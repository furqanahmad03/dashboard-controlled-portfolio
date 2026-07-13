"use client"

import { useRef } from "react"
import Image from "next/image"
import { Settings2, ImagePlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { BlogState } from "@/interfaces/Blog"
import { BlogThumbnailPlaceholder } from "@/components/Dashboard/Blog/BlogThumbnailPlaceholder"
import { BlogFormData } from "@/components/Dashboard/Blog/types"

interface BlogSettingsSheetProps {
  formData: BlogFormData
  setFormData: React.Dispatch<React.SetStateAction<BlogFormData>>
  isUploadingThumbnail: boolean
  onUploadThumbnail: (file: File) => Promise<void>
  forceIsBlogValue?: boolean
  forceIsCaseStudyValue?: boolean
  disableIsBlog?: boolean
  disableIsCaseStudy?: boolean
}

export default function BlogSettingsSheet({
  formData,
  setFormData,
  isUploadingThumbnail,
  onUploadThumbnail,
  forceIsBlogValue,
  forceIsCaseStudyValue,
  disableIsBlog = false,
  disableIsCaseStudy = false,
}: BlogSettingsSheetProps) {
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null)

  const resolvedIsBlog = forceIsBlogValue ?? formData.isBlog
  const resolvedIsCaseStudy = forceIsCaseStudyValue ?? formData.isCaseStudy

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" type="button">
          <Settings2 className="mr-2 h-4 w-4" />
          Blog Settings
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Blog Settings</SheetTitle>
          <SheetDescription>
            Configure thumbnail and publish flags. Thumbnail and inline images are optional.
          </SheetDescription>
        </SheetHeader>

        <div className="p-4 pt-0 space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold">Thumbnail</h3>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isUploadingThumbnail}
              onClick={() => thumbnailInputRef.current?.click()}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              {isUploadingThumbnail ? "Uploading..." : "Upload Thumbnail"}
            </Button>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  void onUploadThumbnail(file)
                }
                event.target.value = ""
              }}
            />

            {formData.thumbnail ? (
              <div className="relative h-48 rounded-md overflow-hidden border">
                <Image src={formData.thumbnail} alt="blog-thumbnail" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <BlogThumbnailPlaceholder />
            )}

            {formData.thumbnail && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    thumbnail: "",
                    thumbnailPublicId: "",
                  }))
                }
              >
                Remove Thumbnail
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Publish Settings</h3>

            <div className="space-y-2">
              <Label htmlFor="blog-state">State</Label>
              <Select
                value={formData.state}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, state: value as BlogState }))
                }
              >
                <SelectTrigger id="blog-state" className="w-full">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="isBlog">Show in /blogs</Label>
                <Checkbox
                  id="isBlog"
                  checked={resolvedIsBlog}
                  disabled={disableIsBlog || forceIsBlogValue !== undefined}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isBlog: checked === true }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isCaseStudy">Enable case study</Label>
                <Checkbox
                  id="isCaseStudy"
                  checked={resolvedIsCaseStudy}
                  disabled={disableIsCaseStudy || forceIsCaseStudyValue !== undefined}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isCaseStudy: checked === true }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured</Label>
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, featured: checked === true }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {resolvedIsBlog && <Badge variant="outline">Blog</Badge>}
              {resolvedIsCaseStudy && <Badge variant="outline">Case Study</Badge>}
              {!resolvedIsBlog && !resolvedIsCaseStudy && (
                <Badge variant="destructive">Hidden</Badge>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
