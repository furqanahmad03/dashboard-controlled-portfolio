"use client"

import Image from "next/image"
import { type MutableRefObject } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ForwardRefEditor } from "@/components/mdx-editor/ForwardRefEditor"
import { type MDXEditorMethods } from "@mdxeditor/editor"

interface UploadedImageMeta {
  url: string
  publicId: string
}

interface BlogWritingFormProps {
  title: string
  brief: string
  content: string
  images: string[]
  diffMarkdown: string
  contentEditorRef: MutableRefObject<MDXEditorMethods | null>
  onTitleChange: (value: string) => void
  onBriefChange: (value: string) => void
  onContentChange: (value: string) => void
  onUploadedImage: (meta: UploadedImageMeta) => void
  onRemoveImage: (index: number) => void
  titlePlaceholder?: string
}

export default function BlogWritingForm({
  title,
  brief,
  content,
  images,
  diffMarkdown,
  contentEditorRef,
  onTitleChange,
  onBriefChange,
  onContentChange,
  onUploadedImage,
  onRemoveImage,
  titlePlaceholder = "Enter blog title",
}: BlogWritingFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="blog-title">Title</Label>
          <Input
            id="blog-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={titlePlaceholder}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="blog-brief">Brief</Label>
          <Textarea
            id="blog-brief"
            value={brief}
            onChange={(e) => onBriefChange(e.target.value)}
            placeholder="Write a short summary"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>MDX / Markdown Content</Label>
          <p className="text-sm text-muted-foreground">
            Full MDX toolbar is enabled with headings, lists, links, images, tables, front-matter, directives, JSX components, and diff/source mode.
          </p>
          <div className="rounded-md border bg-white max-h-[70vh] overflow-y-auto">
            <ForwardRefEditor
              ref={contentEditorRef}
              markdown={content}
              diffMarkdown={diffMarkdown}
              onUploadedImage={onUploadedImage}
              onChange={onContentChange}
            />
          </div>
        </div>

        {images.length > 0 ? (
          <div className="space-y-2">
            <Label>Uploaded Content Images ({images.length})</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((image, index) => (
                <div key={`${image}-${index}`} className="border rounded-md overflow-hidden">
                  <div className="relative h-24">
                    <Image src={image} alt={`editor-image-${index}`} fill className="object-cover" unoptimized />
                  </div>
                  <div className="p-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => onRemoveImage(index)}
                    >
                      Remove From Metadata
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Inline images are optional. Add them only when needed.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
