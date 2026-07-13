import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { errorResponseSchema, successResponseSchema } from "@/lib/validations"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Unauthorized",
      })
      return NextResponse.json(response, { status: 401 })
    }

    const { id } = await params
    const query = await prisma.contactQuery.findUnique({
      where: { id },
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!query) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Query not found",
      })
      return NextResponse.json(response, { status: 404 })
    }

    const response = successResponseSchema.parse({
      success: true,
      message: "Query fetched successfully",
      data: query,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching query:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to fetch query",
    })
    return NextResponse.json(response, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Unauthorized",
      })
      return NextResponse.json(response, { status: 401 })
    }

    const { id } = await params

    const existingQuery = await prisma.contactQuery.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!existingQuery) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Query not found",
      })
      return NextResponse.json(response, { status: 404 })
    }

    await prisma.contactQuery.delete({
      where: { id },
    })

    const response = successResponseSchema.parse({
      success: true,
      message: "Query deleted successfully",
      data: { id },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error deleting query:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to delete query",
    })
    return NextResponse.json(response, { status: 500 })
  }
}
