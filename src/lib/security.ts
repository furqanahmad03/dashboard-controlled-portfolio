import { prisma } from "@/lib/prisma"

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const parseAdminEmailsFromEnv = (): Set<string> => {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || ""

  return new Set(
    raw
      .split(",")
      .map((email) => normalizeEmail(email))
      .filter(Boolean)
  )
}

export const isSignupEnabled = (): boolean => {
  return process.env.ENABLE_SIGNUP !== "false"
}

export const isPortfolioAdminEmail = async (
  email?: string | null
): Promise<boolean> => {
  if (!email) {
    return false
  }

  const normalizedEmail = normalizeEmail(email)
  const envAdmins = parseAdminEmailsFromEnv()

  // If admin emails are configured explicitly, use them as source of truth.
  if (envAdmins.size > 0) {
    return envAdmins.has(normalizedEmail)
  }

  // Secure-by-default fallback: only the earliest created account is treated as admin.
  const owner = await prisma.user.findFirst({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      email: true,
    },
  })

  if (!owner?.email) {
    return false
  }

  return normalizeEmail(owner.email) === normalizedEmail
}
