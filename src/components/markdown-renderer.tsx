"use client"

import { useMemo } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "@/components/providers/theme-provider"
import { MermaidDiagram } from "@/components/mermaid-diagram"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const { theme } = useTheme()

  const syntaxStyle = useMemo(() => {
    const baseStyle = theme === "dark" ? oneDark : oneLight

    return Object.fromEntries(
      Object.entries(baseStyle).map(([selector, styleValue]) => {
        const typedStyle = styleValue as Record<string, unknown>
        const { background, backgroundColor, ...rest } = typedStyle
        return [selector, rest]
      })
    )
  }, [theme])

  const markdownComponents: Components = {
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold mt-7 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>,
    p: ({ children }) => <p className="leading-7 mb-4 text-muted-foreground">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
    li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
    table: ({ children }) => (
      <div className="my-6 w-full overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-muted/70">{children}</thead>,
    tbody: ({ children }) => <tbody className="bg-background">{children}</tbody>,
    tr: ({ children }) => <tr className="border-b">{children}</tr>,
    th: ({ children }) => (
      <th className="px-4 py-2 text-left font-semibold text-foreground border-r last:border-r-0">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 align-top text-muted-foreground border-r last:border-r-0">{children}</td>
    ),
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http")
      return (
        <a
          href={href}
          className="text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-500"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      )
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500/60 pl-4 italic text-muted-foreground my-4">
        {children}
      </blockquote>
    ),
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "")
      const codeText = String(children).replace(/\n$/, "")

      if (!match) {
        return (
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm" {...props}>
            {children}
          </code>
        )
      }

      // Handle mermaid diagrams
      if (match[1] === "mermaid") {
        return <MermaidDiagram diagram={codeText} />
      }

      return (
        <div className="my-4 overflow-hidden rounded-lg border bg-muted/70 dark:bg-muted/40">
          <SyntaxHighlighter
            language={match[1]}
            style={syntaxStyle}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: "0.875rem",
              padding: "1rem",
              background: "transparent",
            }}
          >
            {codeText}
          </SyntaxHighlighter>
        </div>
      )
    },
    img: ({ alt, src }) => {
      if (!src) return null

      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || "content image"}
          className="my-4 w-full h-auto rounded-lg border object-contain"
          loading="lazy"
        />
      )
    },
  }

  return (
    <div className={cn("w-full", className)}>
      <ReactMarkdown
        components={markdownComponents}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
