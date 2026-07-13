import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponseSchema, errorResponseSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '2')
    const excludeSlug = searchParams.get('exclude')
    
    const whereClause: Record<string, unknown> = {
      featured: true,
      isEnabled: true
    }
    
    if (excludeSlug) {
      whereClause.slug = { not: excludeSlug }
    }
    
    const projects = await prisma.project.findMany({
      where: whereClause,
      select: {
        id: true,
        slug: true,
        title: true,
        brief: true,
        thumbnail: true,
        category: true,
        status: true,
        stack: true,
        live: true,
        repository: true,
        featured: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })
    
    const response = successResponseSchema.parse({
      success: true,
      message: "Featured projects fetched successfully",
      data: projects
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching featured projects:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to fetch featured projects",
      message: "An error occurred while fetching featured projects"
    })
    return NextResponse.json(response, { status: 500 })
  }
}
