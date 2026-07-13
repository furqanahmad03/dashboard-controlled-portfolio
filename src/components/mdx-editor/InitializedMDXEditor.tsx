"use client"

import "@mdxeditor/editor/style.css"
import type { ForwardedRef } from "react"
import {
  AdmonitionDirectiveDescriptor,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  DiffSourceToggleWrapper,
  GenericDirectiveEditor,
  GenericJsxEditor,
  InsertAdmonition,
  InsertCodeBlock,
  InsertFrontmatter,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  jsxPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  tablePlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type DirectiveDescriptor,
  type JsxComponentDescriptor,
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor"

const codeBlockLanguages = {
  js: "JavaScript",
  ts: "TypeScript",
  jsx: "JavaScript React",
  tsx: "TypeScript React",
  json: "JSON",
  html: "HTML",
  css: "CSS",
  md: "Markdown",
  bash: "Bash",
  mermaid: "Mermaid",
}

const calloutDirectiveDescriptor: DirectiveDescriptor = {
  name: "callout",
  testNode: (node) => node.name === "callout",
  attributes: ["title"],
  hasChildren: true,
  type: "containerDirective",
  Editor: GenericDirectiveEditor,
}

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: "CalloutBox",
    kind: "flow",
    source: "@/components/mdx",
    props: [{ name: "title", type: "string" }],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
  {
    name: "InlineBadge",
    kind: "text",
    source: "@/components/mdx",
    props: [{ name: "label", type: "string" }],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
  {
    name: "MermaidDiagram",
    kind: "flow",
    source: "@/components/mermaid-diagram",
    props: [{ name: "diagram", type: "string" }],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
]

interface UploadedImageMeta {
  url: string
  publicId: string
}

interface InitializedMDXEditorProps extends MDXEditorProps {
  editorRef: ForwardedRef<MDXEditorMethods> | null
  onUploadedImage?: (meta: UploadedImageMeta) => void
  diffMarkdown?: string
}

export default function InitializedMDXEditor({
  editorRef,
  onUploadedImage,
  diffMarkdown,
  ...props
}: InitializedMDXEditorProps) {
  const handleImageUpload = async (image: File) => {
    const formData = new FormData()
    formData.append("file", image)

    const response = await fetch("/api/blogs/upload-editor-image", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Failed to upload image")
    }

    const result = await response.json()
    const imageMeta = {
      url: result.data.url as string,
      publicId: result.data.publicId as string,
    }

    onUploadedImage?.(imageMeta)
    return imageMeta.url
  }

  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        linkPlugin(),
        linkDialogPlugin({
          linkAutocompleteSuggestions: [
            "/",
            "/about",
            "/projects",
            "/blogs",
            "/contact",
          ],
        }),
        tablePlugin(),
        frontmatterPlugin(),
        imagePlugin({
          imageUploadHandler: handleImageUpload,
        }),
        codeBlockPlugin({
          defaultCodeBlockLanguage: "ts",
        }),
        codeMirrorPlugin({
          codeBlockLanguages,
        }),
        directivesPlugin({
          directiveDescriptors: [
            AdmonitionDirectiveDescriptor,
            calloutDirectiveDescriptor,
          ],
        }),
        jsxPlugin({
          jsxComponentDescriptors,
        }),
        diffSourcePlugin({
          viewMode: "rich-text",
          diffMarkdown: diffMarkdown || "",
        }),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper options={["rich-text", "source", "diff"]}>
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => (
                      <>
                        <UndoRedo />
                        <Separator />
                        <BlockTypeSelect />
                        <Separator />
                        <BoldItalicUnderlineToggles />
                        <CodeToggle />
                        <Separator />
                        <ListsToggle />
                        <Separator />
                        <CreateLink />
                        <InsertImage />
                        <InsertTable />
                        <InsertCodeBlock />
                        <InsertFrontmatter />
                        <InsertAdmonition />
                        <InsertThematicBreak />
                      </>
                    ),
                  },
                ]}
              />
            </DiffSourceToggleWrapper>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  )
}
