"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Blog } from "@/interfaces/Blog"

export default function BlogDetailPage() {
  const params = useParams()
  const blogId = params.id as string

  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/public/${blogId}`)

        if (!response.ok) {
          notFound()
          return
        }

        const result = await response.json()
        const resolvedBlog = result?.data as Blog | null

        if (!resolvedBlog) {
          notFound()
          return
        }

        setBlog(resolvedBlog)
      } catch (error) {
        console.error("Error loading blog detail:", error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    if (blogId) {
      void loadBlog()
    }
  }, [blogId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[rgb(15,15,15)] dark:via-[rgb(20,20,20)] dark:to-[rgb(27,27,27)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-6">
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

  if (!blog) {
    return null
  }

  const backHref = blog.project?.slug ? `/projects/${blog.project.slug}/case_study` : "/blogs"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[rgb(15,15,15)] dark:via-[rgb(20,20,20)] dark:to-[rgb(27,27,27)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 flex items-center justify-between gap-3 flex-wrap">
          <Button variant="outline" asChild>
            <Link href="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Link>
          </Button>

          {blog.project?.slug && (
            <Button variant="outline" asChild>
              <Link href={backHref}>Open Linked Case Study</Link>
            </Button>
          )}
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
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge variant="outline">Blog</Badge>
              {blog.project && <Badge variant="outline">Project Linked</Badge>}
            </div>
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
