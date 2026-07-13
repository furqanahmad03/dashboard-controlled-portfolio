"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpenText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Blog } from "@/interfaces/Blog"
import { Project } from "@/interfaces/Project"
import { useRouter } from "next/navigation"

export default function ProjectCaseStudyPage() {
  const params = useParams()
  const router = useRouter();
  const projectSlug = params.slug as string

  const [project, setProject] = useState<Project | null>(null)
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCaseStudy = async () => {
      try {
        const projectResponse = await fetch(`/api/projects/slug/${projectSlug}`)

        if (!projectResponse.ok) {
          notFound()
          return
        }

        const projectResult = await projectResponse.json()
        const resolvedProject = projectResult?.data as Project | undefined

        if (!resolvedProject || !resolvedProject.hasCaseStudy) {
          notFound()
          return
        }

        const blogResponse = await fetch(
          `/api/blogs/project/${resolvedProject.id}?public=true&caseStudy=true`
        )

        if (!blogResponse.ok) {
          notFound()
          return
        }

        const blogResult = await blogResponse.json()
        const resolvedBlog = blogResult?.data as Blog | null

        if (
          !resolvedBlog ||
          !resolvedBlog.isCaseStudy ||
          resolvedBlog.state !== "ACTIVE"
        ) {
          notFound()
          return
        }

        setProject(resolvedProject)
        setBlog(resolvedBlog)
      } catch (error) {
        console.error("Error loading case study:", error)
        notFound()
        return
      } finally {
        setIsLoading(false)
      }
    }

    if (projectSlug) {
      void loadCaseStudy()
    }
  }, [projectSlug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[rgb(15,15,15)] dark:via-[rgb(20,20,20)] dark:to-[rgb(27,27,27)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-6">
          <div className="h-10 w-56 rounded bg-muted animate-pulse" />
          <div className="h-7 w-4/5 rounded bg-muted animate-pulse" />
          <div className="h-5 w-full rounded bg-muted animate-pulse" />
          <div className="h-96 w-full rounded bg-muted animate-pulse" />
          <div className="h-5 w-full rounded bg-muted animate-pulse" />
          <div className="h-5 w-4/5 rounded bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  if (!project || !blog) {
    return null
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[rgb(15,15,15)] dark:via-[rgb(20,20,20)] dark:to-[rgb(27,27,27)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 flex items-center justify-between gap-3 flex-wrap">
          <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

          <Badge variant="outline" className="text-sm px-3 py-1">
            <BookOpenText className="mr-2 h-4 w-4" />
            Case Study
          </Badge>
        </div>

        <Card className="overflow-hidden py-0 border border-gray-200 dark:border-gray-800">
          {blog.thumbnail && (
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={blog.thumbnail}
                alt={blog.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <CardHeader className="pt-6">
            <CardTitle className="text-3xl md:text-4xl leading-tight">{blog.title}</CardTitle>
            {blog.brief && <p className="text-muted-foreground mt-2 text-lg">{blog.brief}</p>}
          </CardHeader>

          <CardContent className="pb-8">
            <MarkdownRenderer content={blog.content} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}