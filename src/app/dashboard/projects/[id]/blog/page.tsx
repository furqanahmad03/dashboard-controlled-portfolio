"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { toast } from "sonner"
import { ArrowLeft, ExternalLink, FileText } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Blog } from "@/interfaces/Blog"
import { Project } from "@/interfaces/Project"

export default function DashboardProjectBlogPage() {
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectResponse, blogResponse] = await Promise.all([
          fetch(`/api/projects/${projectId}`, { credentials: "include" }),
          fetch(`/api/blogs/project/${projectId}`, { credentials: "include" }),
        ])

        if (!projectResponse.ok) {
          if (projectResponse.status === 401 || projectResponse.status === 403) {
            notFound()
            return
          }
          throw new Error("Failed to fetch project")
        }

        const projectResult = await projectResponse.json()
        if (!projectResult.success || !projectResult.data) {
          throw new Error("Project not found")
        }

        setProject(projectResult.data)

        if (!blogResponse.ok) {
          if (blogResponse.status === 401 || blogResponse.status === 403) {
            notFound()
            return
          }
          throw new Error("Failed to fetch blog")
        }

        const blogResult = await blogResponse.json()
        setBlog(blogResult.data || null)
      } catch (error) {
        console.error("Error loading dashboard blog page:", error)
        toast.error("Failed to load blog/case study data")
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      loadData()
    }
  }, [projectId])

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-56" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Blog / Case Study</h1>
          <p className="text-muted-foreground mt-1">
            View content attached to {project.title}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/projects/${projectId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/projects/${projectId}/blog/edit`}>
              Edit Blog / Case Study
            </Link>
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
            <BreadcrumbLink href="/dashboard/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href={`/dashboard/projects/${projectId}`}>
              {project.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Blog / Case Study</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {!project.hasCaseStudy && (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            This project currently has <strong>Has Case Study</strong> disabled in project settings.
            You can still draft a blog entry, but public case-study page access requires enabling it.
          </CardContent>
        </Card>
      )}

      {!blog ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <FileText className="h-10 w-10 text-muted-foreground mb-3" />
              <h2 className="text-xl font-semibold">No Blog / Case Study Yet</h2>
              <p className="text-muted-foreground mt-1 mb-4">
                Create one to document implementation details, outcomes, and lessons.
              </p>
              <Button asChild>
                <Link href={`/dashboard/projects/${projectId}/blog/edit`}>
                  Create Blog / Case Study
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <CardTitle className="text-2xl">{blog.title}</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={blog.state === "ACTIVE" ? "default" : "secondary"}>
                  {blog.state}
                </Badge>
                {blog.isBlog && <Badge variant="outline">Blog</Badge>}
                {blog.isCaseStudy && <Badge variant="outline">Case Study</Badge>}
              </div>
            </div>

            {blog.brief && <p className="text-muted-foreground">{blog.brief}</p>}

            <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
              <span>Created: {blog.createdAt ? format(new Date(blog.createdAt), "PPP") : "-"}</span>
              <span>Updated: {blog.updatedAt ? format(new Date(blog.updatedAt), "PPP") : "-"}</span>
              {project.slug && (
                <Link
                  href={`/projects/${project.slug}/case_study`}
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Public Case Study
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {blog.thumbnail && (
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border mb-6">
                <Image
                  src={blog.thumbnail}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <MarkdownRenderer content={blog.content} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
