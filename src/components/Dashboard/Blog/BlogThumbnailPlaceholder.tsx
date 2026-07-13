import { ImageOff } from "lucide-react"

interface BlogThumbnailPlaceholderProps {
  message?: string
}

export function BlogThumbnailPlaceholder({
  message = "Thumbnail is optional. Add one to improve blog cards and previews.",
}: BlogThumbnailPlaceholderProps) {
  return (
    <div className="h-48 rounded-md border border-dashed flex flex-col items-center justify-center text-muted-foreground px-4 text-center">
      <ImageOff className="h-6 w-6 mb-2" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
