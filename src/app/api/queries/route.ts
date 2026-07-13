import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { errorResponseSchema, successResponseSchema } from "@/lib/validations"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Unauthorized",
      })
      return NextResponse.json(response, { status: 401 })
    }

    const queries = await prisma.contactQuery.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            replies: true,
          },
        },
      },
    })

    const response = successResponseSchema.parse({
      success: true,
      message: "Queries fetched successfully",
      data: queries,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching queries:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to fetch queries",
    })
    return NextResponse.json(response, { status: 500 })
  }
}
