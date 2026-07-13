"use client"

import { ChangeEvent, useRef, useState } from "react"
import { AlertTriangle, Database, Download, FileJson, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ImportError = {
  error?: string
  code?: string
  issues?: string[]
  recoverySucceeded?: boolean
}

type RestoreMode = "atomic" | "standalone"

export default function DatabasePage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [standaloneConfirmOpen, setStandaloneConfirmOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [issues, setIssues] = useState<string[]>([])

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await fetch("/api/database", { credentials: "include" })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || "Export failed")
      }

      const blob = await response.blob()
      const disposition = response.headers.get("content-disposition")
      const filename = disposition?.match(/filename="([^"]+)"/)?.[1] ?? "portfolio-backup.json"
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      toast.success("Database backup exported")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed")
    } finally {
      setExporting(false)
    }
  }

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setIssues([])
    if (!file) return setSelectedFile(null)
    if (!file.name.toLowerCase().endsWith(".json")) {
      toast.error("Choose a JSON backup file")
      event.target.value = ""
      return setSelectedFile(null)
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error("The backup file must be 25 MB or smaller")
      event.target.value = ""
      return setSelectedFile(null)
    }
    setSelectedFile(file)
  }

  const handleImport = async (mode: RestoreMode) => {
    if (!selectedFile) return
    setImporting(true)
    setIssues([])
    try {
      const text = await selectedFile.text()
      let backup: unknown
      try {
        backup = JSON.parse(text)
      } catch {
        throw new Error("The selected file is not valid JSON")
      }

      const response = await fetch(
        mode === "standalone" ? "/api/database?mode=standalone" : "/api/database",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(backup),
        }
      )
      const body = (await response.json().catch(() => ({}))) as ImportError
      if (!response.ok) {
        setIssues(body.issues ?? [])
        if (body.code === "TRANSACTIONS_UNAVAILABLE") {
          setConfirmOpen(false)
          setStandaloneConfirmOpen(true)
          toast.warning("MongoDB transactions are unavailable. Review the standalone restore warning.")
          return
        }
        throw new Error(body.error || "Import failed")
      }

      toast.success(
        mode === "standalone"
          ? "Database restored in standalone mode"
          : "Database restored successfully"
      )
      setConfirmOpen(false)
      setStandaloneConfirmOpen(false)
      setSelectedFile(null)
      if (inputRef.current) inputRef.current.value = ""
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Import failed")
      setConfirmOpen(false)
      if (mode === "standalone") setStandaloneConfirmOpen(false)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl space-y-8 p-6 pt-20 md:pt-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-3">
            <Database className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Database</h1>
            <p className="text-lg text-muted-foreground">Export a complete backup or restore one safely.</p>
          </div>
        </div>

        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold">Backups contain sensitive data</p>
              <p className="mt-1 text-muted-foreground">
                The export includes every database collection, including password hashes, connected accounts,
                sessions, contact messages, and profile data. Store it securely and never commit it to source control.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                <Download className="h-5 w-5 text-blue-500" />
              </div>
              <CardTitle>Export all data</CardTitle>
              <CardDescription>
                Download a versioned JSON backup containing every record and its original IDs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={handleExport} disabled={exporting || importing}>
                {exporting ? <Loader2 className="animate-spin" /> : <Download />}
                {exporting ? "Preparing backup…" : "Download backup"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                <Upload className="h-5 w-5 text-emerald-500" />
              </div>
              <CardTitle>Import all data</CardTitle>
              <CardDescription>
                Restore a JSON backup after validating its format, unique fields, dates, IDs, and every relation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                ref={inputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleFile}
                className="block w-full cursor-pointer rounded-md border text-sm file:mr-3 file:border-0 file:border-r file:bg-muted file:px-3 file:py-2 file:font-medium"
                disabled={importing || exporting}
              />
              {selectedFile && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileJson className="h-4 w-4" />
                  <span className="truncate">{selectedFile.name}</span>
                  <span>({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
              <Button
                variant="destructive"
                className="w-full"
                disabled={!selectedFile || importing || exporting}
                onClick={() => setConfirmOpen(true)}
              >
                <Upload />
                Validate and restore
              </Button>
            </CardContent>
          </Card>
        </div>

        {issues.length > 0 && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Backup validation failed</CardTitle>
              <CardDescription>No database records were changed.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="max-h-72 list-disc space-y-1 overflow-y-auto pl-5 text-sm">
                {issues.map((issue, index) => <li key={`${issue}-${index}`}>{issue}</li>)}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={confirmOpen} onOpenChange={(open) => !importing && setConfirmOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace the entire database?</DialogTitle>
            <DialogDescription>
              All current records will be replaced by the contents of {selectedFile?.name}. Validation happens
              before deletion, and the restore runs in one transaction, but this action cannot be undone without a backup.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={importing}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleImport("atomic")} disabled={importing}>
              {importing ? <Loader2 className="animate-spin" /> : <Upload />}
              {importing ? "Restoring…" : "Replace all data"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={standaloneConfirmOpen}
        onOpenChange={(open) => !importing && setStandaloneConfirmOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle>Restore without transaction protection?</DialogTitle>
            <DialogDescription className="space-y-3">
              <span className="block">
                This MongoDB server is not configured as a replica set, so it cannot perform an atomic restore.
              </span>
              <span className="block font-medium text-foreground">
                The server will save a temporary recovery snapshot and attempt to restore it if importing fails.
                A process crash, lost connection, or failed recovery can still leave the database incomplete.
              </span>
              <span className="block">
                Continuing will replace all current records with {selectedFile?.name}.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStandaloneConfirmOpen(false)}
              disabled={importing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleImport("standalone")}
              disabled={importing}
            >
              {importing ? <Loader2 className="animate-spin" /> : <AlertTriangle />}
              {importing ? "Restoring without transaction…" : "Accept risk and restore"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
