"use client"

import dynamic from "next/dynamic"
import { forwardRef } from "react"
import {
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor"

interface UploadedImageMeta {
  url: string
  publicId: string
}

interface ForwardRefEditorProps extends MDXEditorProps {
  onUploadedImage?: (meta: UploadedImageMeta) => void
  diffMarkdown?: string
}

const Editor = dynamic(() => import("./InitializedMDXEditor"), {
  ssr: false,
})

export const ForwardRefEditor = forwardRef<MDXEditorMethods, ForwardRefEditorProps>(
  (props, ref) => <Editor {...props} editorRef={ref} />
)

ForwardRefEditor.displayName = "ForwardRefEditor"
