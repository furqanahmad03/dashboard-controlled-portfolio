import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponseSchema, successResponseSchema } from "@/lib/validations"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const blog = await prisma.blog.findFirst({
      where: {
        id,
        isBlog: true,
        state: "ACTIVE",
      },
      include: {
        project: {
          select: {
            id: true,
            slug: true,
            title: true,
            hasCaseStudy: true,
          },
        },
      },
    })

    if (!blog) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Blog not found",
      })
      return NextResponse.json(response, { status: 404 })
    }

    const response = successResponseSchema.parse({
      success: true,
      message: "Public blog fetched successfully",
      data: blog,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching public blog:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to fetch blog",
    })
    return NextResponse.json(response, { status: 500 })
  }
}
