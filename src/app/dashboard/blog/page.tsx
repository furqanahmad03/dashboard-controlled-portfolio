"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { FileText, Plus, Pencil, FolderOpen } from "lucide-react"
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
import { Blog } from "@/interfaces/Blog"

export default function DashboardBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await fetch("/api/blogs", { credentials: "include" })

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            notFound()
            return
          }
          throw new Error("Failed to fetch blogs")
        }

        const result = await response.json()
        setBlogs(result.data || [])
      } catch (error) {
        console.error("Error loading dashboard blogs:", error)
        setBlogs([])
      } finally {
        setIsLoading(false)
      }
    }

    void loadBlogs()
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
            <Card key={index} className="overflow-hidden">
              <div className="h-44 bg-muted animate-pulse" />
              <CardContent className="pt-5 space-y-3">
                <div className="h-6 w-4/5 bg-muted rounded animate-pulse" />
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
          <h1 className="text-3xl font-bold">Blogs</h1>
          <p className="text-muted-foreground mt-1">
            Manage all blogs, including project-linked case studies and raw blogs.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Blog
          </Link>
        </Button>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Blogs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {blogs.length === 0 ? (
        <Card>
          <CardContent className="pt-8 pb-8 text-center">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h2 className="text-2xl font-semibold mb-2">No Blogs Found</h2>
            <p className="text-muted-foreground mb-4">
              Create a raw blog from here, or create project-linked case studies from a project page.
            </p>
            <Button asChild>
              <Link href="/dashboard/blog/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Raw Blog
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {blogs.map((blog, index) => {
            const isProjectLinked = Boolean(blog.projectId)
            const editHref = isProjectLinked
              ? `/dashboard/projects/${blog.projectId}/blog/edit`
              : blog.id
                ? `/dashboard/blog/${blog.id}/edit`
                : "/dashboard/blog"
            const viewHref = isProjectLinked
              ? `/dashboard/projects/${blog.projectId}/blog`
              : blog.id
                ? `/blogs/${blog.id}`
                : "/blogs"

            return (
              <Card key={blog.id || `${blog.title}-${index}`} className="overflow-hidden">
                {blog.thumbnail ? (
                  <div className="relative h-44 w-full border-b">
                    <Image src={blog.thumbnail} alt={blog.title} fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="h-44 w-full border-b bg-muted flex items-center justify-center text-muted-foreground text-sm">
                    No thumbnail
                  </div>
                )}

                <CardHeader className="space-y-2 pt-4">
                  <CardTitle className="text-xl line-clamp-2">{blog.title}</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={blog.state === "ACTIVE" ? "default" : "secondary"}>{blog.state}</Badge>
                    {blog.isBlog && <Badge variant="outline">Blog</Badge>}
                    {blog.isCaseStudy && <Badge variant="outline">Case Study</Badge>}
                    {isProjectLinked ? <Badge variant="outline">Project Linked</Badge> : <Badge variant="outline">Raw</Badge>}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {blog.brief ? (
                    <p className="text-sm text-muted-foreground line-clamp-3">{blog.brief}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No brief provided.</p>
                  )}

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      {isProjectLinked
                        ? `Project: ${blog.project?.title || "Unknown Project"}`
                        : "Type: Raw Blog"}
                    </p>
                    <p>
                      Updated: {blog.updatedAt ? format(new Date(blog.updatedAt), "PPP") : "-"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button asChild className="flex-1">
                      <Link href={editHref}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={viewHref}>
                        <FolderOpen className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
