"use client"

import { FormEvent, useEffect, useState } from "react"
import { notFound, useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ContactQuery, ContactQueryReply } from "@/interfaces/Query"
import { ArrowLeft, Send, Trash2 } from "lucide-react"

interface ContactQueryDetail extends ContactQuery {
  replies: ContactQueryReply[]
}

export default function DashboardQueryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryId = params.id as string

  const [query, setQuery] = useState<ContactQueryDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [replySubject, setReplySubject] = useState("")
  const [replyMessage, setReplyMessage] = useState("")

  useEffect(() => {
    const loadQuery = async () => {
      try {
        const response = await fetch(`/api/queries/${queryId}`, {
          credentials: "include",
        })

        if (!response.ok) {
          if (response.status === 401 || response.status === 403 || response.status === 404) {
            notFound()
            return
          }
          throw new Error("Failed to fetch query")
        }

        const result = await response.json()
        const fetchedQuery: ContactQueryDetail | null = result.data || null
        setQuery(fetchedQuery)

        if (fetchedQuery && !replySubject) {
          setReplySubject(`Re: ${fetchedQuery.subject}`)
        }
      } catch (error) {
        console.error("Error loading query:", error)
        toast.error("Failed to load query")
      } finally {
        setIsLoading(false)
      }
    }

    void loadQuery()
  }, [queryId])

  const handleReply = async (event: FormEvent) => {
    event.preventDefault()

    if (!replySubject.trim() || !replyMessage.trim()) {
      toast.error("Subject and message are required")
      return
    }

    try {
      setIsSending(true)
      const response = await fetch(`/api/queries/${queryId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          subject: replySubject.trim(),
          message: replyMessage.trim(),
        }),
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          notFound()
          return
        }
        const errorResult = await response.json().catch(() => ({}))
        throw new Error(errorResult.error || "Failed to send reply")
      }

      setReplyMessage("")
      toast.success("Reply sent successfully")

      const reloadResponse = await fetch(`/api/queries/${queryId}`, {
        credentials: "include",
      })

      if (reloadResponse.ok) {
        const reloadResult = await reloadResponse.json()
        setQuery(reloadResult.data || null)
      }
    } catch (error) {
      console.error("Error replying to query:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send reply")
    } finally {
      setIsSending(false)
    }
  }

  const handleDelete = async () => {
    if (!query) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/queries/${queryId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          notFound()
          return
        }
        const errorResult = await response.json().catch(() => ({}))
        throw new Error(errorResult.error || "Failed to delete query")
      }

      toast.success("Query deleted successfully")
      setIsDeleteDialogOpen(false)
      router.push("/dashboard/queries")
    } catch (error) {
      console.error("Error deleting query:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete query")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-40 w-full bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (!query) {
    return null
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Query Details</h1>
          <p className="text-muted-foreground mt-1">
            View message history and send replies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/queries">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Queries
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard/queries">Queries</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{query.subject}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-2xl">{query.subject}</CardTitle>
            <Badge variant="outline">{query.replies?.length || 0} replies</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Name:</strong> {query.name}</p>
            <p><strong>Email:</strong> {query.email}</p>
            <p><strong>Received:</strong> {query.createdAt ? format(new Date(query.createdAt), "PPP p") : "-"}</p>
          </div>
          <div className="rounded-md border p-4 whitespace-pre-wrap text-sm">
            {query.message}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Replies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {query.replies && query.replies.length > 0 ? (
            query.replies.map((reply) => (
              <div key={reply.id} className="rounded-md border p-4 space-y-2">
                <p className="text-sm font-semibold">{reply.subject}</p>
                <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>From: {reply.senderEmail}</p>
                  <p>To: {reply.recipientEmail}</p>
                  <p>Sent: {reply.createdAt ? format(new Date(reply.createdAt), "PPP p") : "-"}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No replies yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send Reply</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReply} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={replySubject}
                onChange={(event) => setReplySubject(event.target.value)}
                placeholder="Reply subject"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={replyMessage}
                onChange={(event) => setReplyMessage(event.target.value)}
                placeholder="Write your reply..."
                className="min-h-32"
                required
              />
            </div>
            <Button type="submit" disabled={isSending}>
              <Send className="mr-2 h-4 w-4" />
              {isSending ? "Sending..." : "Send Reply"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-background border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Delete Query
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 dark:text-gray-300">
              Are you sure you want to delete &quot;{query.subject}&quot;? This will also delete all replies and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="h-11 px-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-11 px-6"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
