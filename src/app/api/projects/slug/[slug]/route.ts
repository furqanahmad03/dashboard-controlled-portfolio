import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponseSchema, errorResponseSchema } from "@/lib/validations"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const project = await prisma.project.findUnique({
      where: { slug: slug },
      include: {
        education: { select: { institution: true, institutionLogo: true } },
        company: { select: { name: true, logo: true } },
        certification: { select: { title: true, logo: true } },
        client: { select: { id: true, name: true, country: true } }
      }
    })
    
    if (!project) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Project not found",
        message: "The requested project could not be found"
      })
      return NextResponse.json(response, { status: 404 })
    }
    
    if (project.client) {
      project.client = {
        id: project.client.id,
        name: "Client",
        country: project.client.country
      }
    }
    
    const response = successResponseSchema.parse({
      success: true,
      message: "Project fetched successfully",
      data: project
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching project by slug:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to fetch project",
      message: "An error occurred while fetching the project"
    })
    return NextResponse.json(response, { status: 500 })
  }
}
