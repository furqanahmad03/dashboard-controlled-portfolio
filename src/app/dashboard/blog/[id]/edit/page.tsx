"use client"

import { useParams } from "next/navigation"
import RawBlogEditor from "@/components/Dashboard/Blog/RawBlogEditor"

export default function DashboardRawBlogEditPage() {
  const params = useParams()
  const blogId = params.id as string

  return <RawBlogEditor blogId={blogId} />
}
