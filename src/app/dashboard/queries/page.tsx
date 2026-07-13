"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ContactQuery } from "@/interfaces/Query"
import { Eye, Inbox } from "lucide-react"

export default function DashboardQueriesPage() {
  const [queries, setQueries] = useState<ContactQuery[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadQueries = async () => {
      try {
        const response = await fetch("/api/queries", { credentials: "include" })

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            notFound()
            return
          }
          throw new Error("Failed to fetch queries")
        }

        const result = await response.json()
        setQueries(result.data || [])
      } catch (error) {
        console.error("Error loading queries:", error)
        setQueries([])
      } finally {
        setIsLoading(false)
      }
    }

    void loadQueries()
  }, [])

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-4 w-96 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardContent className="pt-6 space-y-3">
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Queries</h1>
          <p className="text-muted-foreground mt-1">
            View contact form submissions and manage email replies.
          </p>
        </div>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Queries</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {queries.length === 0 ? (
        <Card>
          <CardContent className="pt-8 pb-8 text-center">
            <Inbox className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h2 className="text-2xl font-semibold mb-2">No Queries Found</h2>
            <p className="text-muted-foreground">
              New contact submissions will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {queries.map((query) => (
            <Card key={query.id}>
              <CardHeader className="space-y-3 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-xl line-clamp-2">{query.subject}</CardTitle>
                  <Badge variant="outline">{query._count?.replies || 0} replies</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Name:</strong> {query.name}</p>
                  <p><strong>Email:</strong> {query.email}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-4">{query.message}</p>
                <p className="text-xs text-muted-foreground">
                  Received: {query.createdAt ? format(new Date(query.createdAt), "PPP p") : "-"}
                </p>

                <Button asChild className="w-full">
                  <Link href={`/dashboard/queries/${query.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View & Reply
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
