"use client"

import { useEffect, useRef, useState } from "react"
import { notFound, useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, Save } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import BlogWritingForm from "@/components/Dashboard/Blog/BlogWritingForm"
import BlogSettingsSheet from "@/components/Dashboard/Blog/BlogSettingsSheet"
import { type MDXEditorMethods } from "@mdxeditor/editor"
import { Blog } from "@/interfaces/Blog"
import { Project } from "@/interfaces/Project"
import {
  BlogFormData,
  defaultProjectBlogFormData,
} from "@/components/Dashboard/Blog/types"

export default function DashboardProjectBlogEditPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<BlogFormData>(defaultProjectBlogFormData)
  const [initialContent, setInitialContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [hasExistingBlog, setHasExistingBlog] = useState(false)
  const [removedImagePublicIds, setRemovedImagePublicIds] = useState<string[]>([])

  const contentEditorRef = useRef<MDXEditorMethods | null>(null)

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
        const blog: Blog | null = blogResult.data || null

        if (blog) {
          setHasExistingBlog(true)
          setInitialContent(blog.content || "")
          setRemovedImagePublicIds([])
          setFormData({
            title: blog.title || "",
            brief: blog.brief || "",
            content: blog.content || "",
            thumbnail: blog.thumbnail || "",
            thumbnailPublicId: blog.thumbnailPublicId || "",
            images: blog.images || [],
            imagePublicIds: blog.imagePublicIds || [],
            isBlog: blog.isBlog,
            isCaseStudy: true,
            state: blog.state,
            isEnabled: blog.isEnabled,
            featured: blog.featured,
          })
        }
      } catch (error) {
        console.error("Error loading blog editor data:", error)
        toast.error("Failed to load blog/case-study editor")
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      void loadData()
    }
  }, [projectId])

  const handleEditorImageUploaded = (meta: { url: string; publicId: string }) => {
    setFormData((prev) => {
      const alreadyExists = prev.images.includes(meta.url) || prev.imagePublicIds.includes(meta.publicId)
      if (alreadyExists) {
        return prev
      }

      return {
        ...prev,
        images: [...prev.images, meta.url],
        imagePublicIds: [...prev.imagePublicIds, meta.publicId],
      }
    })

    setRemovedImagePublicIds((prev) => prev.filter((id) => id !== meta.publicId))
  }

  const handleRemoveImage = (index: number) => {
    const removedPublicId = formData.imagePublicIds[index]
    if (removedPublicId) {
      setRemovedImagePublicIds((prev) =>
        prev.includes(removedPublicId) ? prev : [...prev, removedPublicId]
      )
    }

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePublicIds: prev.imagePublicIds.filter((_, i) => i !== index),
    }))
  }

  const extractImageUrlsFromMarkdown = (markdown: string): Set<string> => {
    const urls = new Set<string>()

    for (const match of markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      if (match[1]) {
        urls.add(match[1])
      }
    }

    for (const match of markdown.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/g)) {
      if (match[1]) {
        urls.add(match[1])
      }
    }

    return urls
  }

  const handleUploadThumbnail = async (file: File) => {
    try {
      setIsUploadingThumbnail(true)

      const payload = new FormData()
      payload.append("file", file)
      if (formData.thumbnailPublicId) {
        payload.append("oldPublicId", formData.thumbnailPublicId)
      }

      const response = await fetch("/api/blogs/upload-thumbnail", {
        method: "POST",
        body: payload,
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          notFound()
          return
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to upload thumbnail")
      }

      const result = await response.json()
      setFormData((prev) => ({
        ...prev,
        thumbnail: result.data.url,
        thumbnailPublicId: result.data.publicId,
      }))

      toast.success("Thumbnail uploaded successfully")
    } catch (error) {
      console.error("Error uploading thumbnail:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload thumbnail")
    } finally {
      setIsUploadingThumbnail(false)
    }
  }

  const handleSave = async () => {
    const latestContent = contentEditorRef.current?.getMarkdown() ?? formData.content
    const usedImageUrls = extractImageUrlsFromMarkdown(latestContent)

    const filteredImages = formData.images.filter((url) => usedImageUrls.has(url))
    const filteredImagePublicIds = formData.imagePublicIds.filter((_, index) =>
      usedImageUrls.has(formData.images[index])
    )
    const autoRemovedImagePublicIds = formData.imagePublicIds.filter(
      (publicId, index) =>
        Boolean(publicId) && !usedImageUrls.has(formData.images[index])
    )
    const mergedRemovedImagePublicIds = [
      ...new Set([...removedImagePublicIds, ...autoRemovedImagePublicIds]),
    ].filter((publicId) => !filteredImagePublicIds.includes(publicId))

    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!latestContent.trim()) {
      toast.error("Content is required")
      return
    }

    try {
      setIsSaving(true)

      const response = await fetch(`/api/blogs/project/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          title: formData.title.trim(),
          brief: formData.brief.trim(),
          content: latestContent,
          isCaseStudy: true,
          isEnabled: true,
          images: filteredImages,
          imagePublicIds: filteredImagePublicIds,
          removedImagePublicIds: mergedRemovedImagePublicIds,
        }),
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          notFound()
          return
        }

        const errorData = await response.json().catch(() => ({}))
        const validationDetails = errorData.details
        if (Array.isArray(validationDetails)) {
          validationDetails.forEach((detail: { message?: string }) => {
            if (detail.message) {
              toast.error(detail.message)
            }
          })
        }

        throw new Error(errorData.error || "Failed to save blog")
      }

      await response.json()
      toast.success(hasExistingBlog ? "Blog updated successfully" : "Blog created successfully")
      setHasExistingBlog(true)
      router.push(`/dashboard/projects/${projectId}/blog`)
    } catch (error) {
      console.error("Error saving blog:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save blog")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
        <div className="space-y-2">
          <div className="h-8 w-80 bg-muted rounded animate-pulse" />
          <div className="h-4 w-96 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-80 w-full bg-muted rounded animate-pulse" />
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
          <h1 className="text-3xl font-bold">
            {hasExistingBlog ? "Edit Blog / Case Study" : "Create Blog / Case Study"}
          </h1>
          <p className="text-muted-foreground mt-1">Project: {project.title}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/projects/${projectId}/blog`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to View
            </Link>
          </Button>

          <BlogSettingsSheet
            formData={formData}
            setFormData={setFormData}
            isUploadingThumbnail={isUploadingThumbnail}
            onUploadThumbnail={handleUploadThumbnail}
            forceIsCaseStudyValue={true}
            disableIsCaseStudy
          />

          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : hasExistingBlog ? "Update" : "Create"}
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
            <BreadcrumbLink href={`/dashboard/projects/${projectId}`}>{project.title}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href={`/dashboard/projects/${projectId}/blog`}>Case Study</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {!project.hasCaseStudy && (
        <Card className="border-yellow-500/40">
          <CardContent className="pt-6 text-sm text-yellow-700 dark:text-yellow-300">
            This project has <strong>Has Case Study</strong> disabled. Enable it in project settings to make the case-study route available publicly.
          </CardContent>
        </Card>
      )}

      <BlogWritingForm
        title={formData.title}
        brief={formData.brief}
        content={formData.content}
        images={formData.images}
        diffMarkdown={initialContent}
        contentEditorRef={contentEditorRef}
        onTitleChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            title: value,
          }))
        }
        onBriefChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            brief: value,
          }))
        }
        onContentChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            content: value,
          }))
        }
        onUploadedImage={handleEditorImageUploaded}
        onRemoveImage={handleRemoveImage}
        titlePlaceholder="Enter blog/case-study title"
      />
    </div>
  )
}
