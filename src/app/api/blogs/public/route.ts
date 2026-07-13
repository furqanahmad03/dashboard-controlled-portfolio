import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponseSchema, successResponseSchema } from "@/lib/validations"

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
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
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    })

    const response = successResponseSchema.parse({
      success: true,
      message: "Public blogs fetched successfully",
      data: blogs,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching public blogs:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to fetch blogs",
    })
    return NextResponse.json(response, { status: 500 })
  }
}
