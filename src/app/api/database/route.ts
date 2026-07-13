import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { Prisma } from "@prisma/client"
import { authOptions } from "@/lib/auth"
import { isPortfolioAdminEmail } from "@/lib/security"
import {
  BackupValidationError,
  StandaloneRestoreError,
  exportDatabase,
  parseAndValidateBackup,
  replaceDatabase,
  replaceDatabaseStandalone,
} from "@/lib/database-backup"

const requireAdmin = async () => {
  const session = await getServerSession(authOptions)
  return Boolean(
    session?.user?.email &&
      session.user.id &&
      (await isPortfolioAdminEmail(session.user.email))
  )
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const backup = await exportDatabase()
    const date = backup.exportedAt.slice(0, 10)
    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="portfolio-backup-${date}.json"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Database export failed:", error)
    return NextResponse.json({ error: "Failed to export the database" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const maxBytes = 25 * 1024 * 1024
  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (contentLength > maxBytes) {
    return NextResponse.json({ error: "Backup file exceeds the 25 MB limit" }, { status: 413 })
  }

  const mode = request.nextUrl.searchParams.get("mode") ?? "atomic"
  if (mode !== "atomic" && mode !== "standalone") {
    return NextResponse.json(
      { error: "Invalid restore mode", code: "INVALID_RESTORE_MODE" },
      { status: 400 }
    )
  }

  try {
    const rawBody = await request.text()
    if (Buffer.byteLength(rawBody, "utf8") > maxBytes) {
      return NextResponse.json({ error: "Backup file exceeds the 25 MB limit" }, { status: 413 })
    }
    const input: unknown = JSON.parse(rawBody)
    const backup = parseAndValidateBackup(input)
    const counts =
      mode === "standalone"
        ? await replaceDatabaseStandalone(backup)
        : await replaceDatabase(backup)
    return NextResponse.json({
      success: true,
      mode,
      message:
        mode === "standalone"
          ? "Database restored without transaction support"
          : "Database restored successfully",
      counts,
    })
  } catch (error) {
    if (error instanceof BackupValidationError) {
      return NextResponse.json(
        { error: error.message, issues: error.issues.slice(0, 100) },
        { status: 400 }
      )
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "The selected file is not valid JSON" }, { status: 400 })
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2031"
    ) {
      console.error("Atomic database import unavailable:", error)
      return NextResponse.json(
        {
          error: "This MongoDB server does not support transactions. Explicit confirmation is required to restore without one.",
          code: "TRANSACTIONS_UNAVAILABLE",
        },
        { status: 409 }
      )
    }
    if (error instanceof StandaloneRestoreError) {
      console.error("Standalone database import failed:", error.restoreError)
      if (error.recoveryError) {
        console.error("Standalone database recovery failed:", error.recoveryError)
      }
      return NextResponse.json(
        {
          error: error.recoverySucceeded
            ? "Import failed, but the previous database contents were recovered."
            : "Import and automatic recovery failed. The database may be partially restored; check the server logs immediately.",
          code: error.recoverySucceeded
            ? "STANDALONE_RESTORE_FAILED"
            : "STANDALONE_RECOVERY_FAILED",
          recoverySucceeded: error.recoverySucceeded,
        },
        { status: 500 }
      )
    }
    console.error("Database import failed:", error)
    return NextResponse.json(
      {
        error:
          mode === "standalone"
            ? "Import could not start. No database records were changed."
            : "Import failed. No data was changed because the restore is transactional.",
      },
      { status: 500 }
    )
  }
}
