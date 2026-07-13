"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/components/providers/theme-provider"

interface MermaidDiagramProps {
  diagram: string
  className?: string
}

export function MermaidDiagram({ diagram, className = "" }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const initMermaid = async () => {
      if (typeof window !== "undefined" && window.mermaid) {
        try {
          // Configure mermaid based on theme
          const isDark = theme === "dark"
          window.mermaid.initialize({
            startOnLoad: true,
            theme: isDark ? "dark" : "default",
            securityLevel: "loose",
            fontSize: 14,
            fontFamily: "inherit",
            darkMode: isDark,
            themeVariables: {
              primaryColor: isDark ? "#374151" : "#f3f4f6",
              primaryTextColor: isDark ? "#ffffff" : "#000000",
              primaryBorderColor: isDark ? "#6b7280" : "#d1d5db",
              lineColor: isDark ? "#9ca3af" : "#6b7280",
              secondBkgColor: isDark ? "#4b5563" : "#e5e7eb",
              tertiaryColor: isDark ? "#6b7280" : "#f9fafb",
              textColor: isDark ? "#ffffff" : "#000000",
              border: isDark ? "#9ca3af" : "#6b7280",
              background: isDark ? "#1f2937" : "#ffffff",
              mainBkg: isDark ? "#374151" : "#f3f4f6",
              secondBkg: isDark ? "#4b5563" : "#e5e7eb",
              signalColor: isDark ? "#9ca3af" : "#6b7280",
              actorBkg: isDark ? "#374151" : "#f3f4f6",
              actorBorder: isDark ? "#9ca3af" : "#6b7280",
              actorTextColor: isDark ? "#ffffff" : "#000000",
              actorLineColor: isDark ? "#9ca3af" : "#6b7280",
            },
          })
          await window.mermaid.run()
        } catch (error) {
          console.error("Error rendering mermaid diagram:", error)
        }
      }
    }

    initMermaid()
  }, [diagram, theme])

  return (
    <div
      className={`my-4 w-full rounded-lg border border-muted bg-muted/50 p-4 dark:bg-muted/20 overflow-x-auto ${className}`}
      ref={ref}
    >
      <div className="mermaid flex justify-center">{diagram}</div>
    </div>
  )
}

