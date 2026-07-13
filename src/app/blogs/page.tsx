"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ArrowRight, CalendarDays, FileText } from "lucide-react"
import { Blog } from "@/interfaces/Blog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/blogs/public")
        const result = await response.json()

        if (response.ok && result.success) {
          setBlogs(result.data || [])
        } else {
          setBlogs([])
        }
      } catch (error) {
        console.error("Error loading blogs:", error)
        setBlogs([])
      } finally {
        setIsLoading(false)
      }
    }

    loadBlogs()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[rgb(15,15,15)] dark:via-[rgb(20,20,20)] dark:to-[rgb(27,27,27)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-bold mb-5 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Blogs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Notes from shipped work, architecture decisions, and case studies from real projects.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="rounded-xl border bg-card p-4 animate-pulse">
                <div className="h-48 rounded-md bg-muted" />
                <div className="h-6 w-4/5 bg-muted rounded mt-4" />
                <div className="h-4 w-full bg-muted rounded mt-3" />
                <div className="h-4 w-2/3 bg-muted rounded mt-2" />
                <div className="h-10 w-full bg-muted rounded mt-5" />
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-8 text-center">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <h2 className="text-2xl font-semibold mb-2">No Public Blogs Yet</h2>
              <p className="text-muted-foreground">
                Published blog/case-study posts will appear here once marked as ACTIVE.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              
              <Card
                key={blog.id}
                className="overflow-hidden py-0 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-52">
                  {blog.thumbnail ? (
                    <Image
                      src={blog.thumbnail}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                      {blog.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <CardContent className="pt-5 space-y-3">

                  <h2 className="text-xl font-semibold line-clamp-2">{blog.title}</h2>

                  {blog.brief && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{blog.brief}</p>
                  )}

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>
                      {blog.project?.title ? (
                        <>
                          Project: <span className="font-medium text-foreground">{blog.project.title}</span>
                        </>
                      ) : (
                        <>
                          Type: <span className="font-medium text-foreground">Raw Blog</span>
                        </>
                      )}
                    </p>
                    <p className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {blog.createdAt ? format(new Date(blog.createdAt), "PPP") : "Date unavailable"}
                    </p>
                  </div>

                  <Button asChild className="w-full mt-2">
                    <Link href={blog.project?.slug ? `/projects/${blog.project.slug}/case_study` : `/blogs/${blog.id}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
