import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponseSchema, successResponseSchema } from "@/lib/validations"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  try {
    const { projectSlug } = await params

    const project = await prisma.project.findUnique({
      where: { slug: projectSlug },
      select: {
        id: true,
        slug: true,
        title: true,
        brief: true,
        thumbnail: true,
        hasCaseStudy: true,
      },
    })

    if (!project || !project.hasCaseStudy) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Case study not found",
      })
      return NextResponse.json(response, { status: 404 })
    }

    const blog = await prisma.blog.findFirst({
      where: {
        projectId: project.id,
        isCaseStudy: true,
        state: "ACTIVE",
      },
    })

    if (!blog) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Case study not found",
      })
      return NextResponse.json(response, { status: 404 })
    }

    const response = successResponseSchema.parse({
      success: true,
      message: "Case study fetched successfully",
      data: {
        project,
        blog,
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching public case study:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to fetch case study",
    })
    return NextResponse.json(response, { status: 500 })
  }
}
