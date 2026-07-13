"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/Navbar"
// import { HireMe } from "@/components/hire-me"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { SmoothScroll } from "@/components/smooth-scroll"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  if (isDashboard) {
    return <>{children}</>
  }

  return (
    <SmoothScroll>
      <Navbar />
      {children}
      {/* <HireMe /> */}
      <Footer />
      <ScrollToTop />
    </SmoothScroll>
  )
} 