"use client"

import { useEffect, useRef, useState } from "react"
import { notFound, useRouter } from "next/navigation"
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
import BlogWritingForm from "@/components/Dashboard/Blog/BlogWritingForm"
import BlogSettingsSheet from "@/components/Dashboard/Blog/BlogSettingsSheet"
import { type MDXEditorMethods } from "@mdxeditor/editor"
import { Blog } from "@/interfaces/Blog"
import {
  BlogFormData,
  defaultRawBlogFormData,
} from "@/components/Dashboard/Blog/types"

interface RawBlogEditorProps {
  blogId?: string
}

export default function RawBlogEditor({ blogId }: RawBlogEditorProps) {
  const router = useRouter()

  const [formData, setFormData] = useState<BlogFormData>(defaultRawBlogFormData)
  const [initialContent, setInitialContent] = useState("")
  const [isLoading, setIsLoading] = useState(Boolean(blogId))
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [hasExistingBlog, setHasExistingBlog] = useState(Boolean(blogId))
  const [removedImagePublicIds, setRemovedImagePublicIds] = useState<string[]>([])

  const contentEditorRef = useRef<MDXEditorMethods | null>(null)

  useEffect(() => {
    const loadBlog = async () => {
      if (!blogId) {
        setIsLoading(false)
        setHasExistingBlog(false)
        setRemovedImagePublicIds([])
        return
      }

      try {
        const response = await fetch(`/api/blogs/${blogId}`, { credentials: "include" })

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            notFound()
            return
          }
          if (response.status === 404) {
            toast.error("Blog not found")
            router.push("/dashboard/blog")
            return
          }
          throw new Error("Failed to fetch blog")
        }

        const result = await response.json()
        const blog: Blog | null = result.data || null

        if (!blog) {
          toast.error("Blog not found")
          router.push("/dashboard/blog")
          return
        }

        if (blog.projectId) {
          toast.info("This blog is linked to a project. Redirecting to project editor.")
          router.push(`/dashboard/projects/${blog.projectId}/blog/edit`)
          return
        }

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
          isBlog: true,
          isCaseStudy: false,
          state: blog.state,
          isEnabled: blog.isEnabled,
          featured: blog.featured,
        })
      } catch (error) {
        console.error("Error loading raw blog editor data:", error)
        toast.error("Failed to load blog editor")
      } finally {
        setIsLoading(false)
      }
    }

    void loadBlog()
  }, [blogId, router])

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

      const endpoint = hasExistingBlog && blogId ? `/api/blogs/${blogId}` : "/api/blogs"
      const method = hasExistingBlog && blogId ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          title: formData.title.trim(),
          brief: formData.brief.trim(),
          content: latestContent,
          isBlog: true,
          isCaseStudy: false,
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
      toast.success(hasExistingBlog ? "Blog updated successfully" : "Raw blog created successfully")
      router.push("/dashboard/blog")
    } catch (error) {
      console.error("Error saving raw blog:", error)
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

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">
            {hasExistingBlog ? "Edit Raw Blog" : "Create Raw Blog"}
          </h1>
          <p className="text-muted-foreground mt-1">Raw blogs are always listed under /blogs.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Link>
          </Button>

          <BlogSettingsSheet
            formData={formData}
            setFormData={setFormData}
            isUploadingThumbnail={isUploadingThumbnail}
            onUploadThumbnail={handleUploadThumbnail}
            forceIsBlogValue={true}
            forceIsCaseStudyValue={false}
            disableIsBlog
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
            <BreadcrumbLink href="/dashboard/blog">Blogs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{hasExistingBlog ? "Edit" : "New"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
      />
    </div>
  )
}
