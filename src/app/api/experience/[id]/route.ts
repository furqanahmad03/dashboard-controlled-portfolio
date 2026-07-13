import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { experienceSchema, successResponseSchema, errorResponseSchema } from "@/lib/validations"
import { z } from "zod"


async function createActivity(
  userId: string,
  type: "Created" | "Updated" | "Deleted",
  entity: "Education" | "Project" | "Certification" | "Profile" | "User",
  entityId: string,
  entityName: string,
  description: string,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        type,
        entity,
        entityId,
        entityName,
        description,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
      },
    })
  } catch (error) {
    console.error("Error creating activity:", error)
  }
}


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json({
        success: false,
        error: "Invalid position ID"
      }, { status: 400 })
    }
    
    const position = await prisma.position.findUnique({
      where: { id: id },
      include: {
        companyRef: true
      }
    })
    
    if (!position) {
      return NextResponse.json({
        success: false,
        error: "Position not found"
      }, { status: 404 })
    }
    
    const transformedPosition = {
      id: position.id,
      position: position.position,
      companyId: position.company,
      joiningDate: position.joiningDate,
      endingDate: position.endingDate,
      description: position.description,
      jobType: position.jobType,
      locationType: position.locationType,
      skills: position.skills,
      createdAt: position.createdAt,
      updatedAt: position.updatedAt,
      company: {
        id: position.companyRef.id,
        name: position.companyRef.name,
        logo: position.companyRef.logo,
        website: position.companyRef.website,
        location: position.companyRef.location,
        createdAt: position.companyRef.createdAt,
        updatedAt: position.companyRef.updatedAt,
      }
    }

    const response = successResponseSchema.parse({
      success: true,
      message: "Position fetched successfully",
      data: transformedPosition
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching position:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.issues
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to fetch position"
    }, { status: 500 })
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Unauthorized"
      })
      return NextResponse.json(response, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "User not found"
      })
      return NextResponse.json(response, { status: 404 })
    }

    const { id } = await params
    const body = await request.json()

    if (!id || typeof id !== 'string') {
      return NextResponse.json({
        success: false,
        error: "Invalid position ID"
      }, { status: 400 })
    }

    const experienceData = {
      title: body.position,
      companyId: body.companyId,
      startDate: new Date(body.joiningDate),
      endDate: body.endingDate ? new Date(body.endingDate) : null,
      description: body.description || "",
      employmentType: body.jobType || "full-time",
      location: body.locationType || "remote",
      skills: body.skills ? (Array.isArray(body.skills) ? body.skills : body.skills.split(',').map((s: string) => s.trim())) : [],
      responsibilities: [],
      achievements: [],
      salary: undefined,
    }

    try {
      experienceSchema.parse(experienceData)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({
          success: false,
          error: "Validation failed",
          details: validationError.issues
        }, { status: 400 })
      }
      throw validationError
    }

    const updatedPosition = await prisma.position.update({
      where: { id },
      data: {
        position: experienceData.title,
        jobType: experienceData.employmentType,
        company: experienceData.companyId,
        joiningDate: experienceData.startDate,
        endingDate: experienceData.endDate,
        locationType: experienceData.location || "",
        description: experienceData.description,
        skills: experienceData.skills,
      },
      include: {
        companyRef: true
      }
    })

    await createActivity(
      user.id,
      "Updated",
      "User",
      updatedPosition.id,
      updatedPosition.position,
      `Updated position: ${updatedPosition.position} at ${updatedPosition.companyRef.name}`,
      {
        position: updatedPosition.position,
        jobType: updatedPosition.jobType,
        company: updatedPosition.companyRef.name,
        joiningDate: updatedPosition.joiningDate,
        endingDate: updatedPosition.endingDate,
        locationType: updatedPosition.locationType,
        skillsCount: updatedPosition.skills.length,
      }
    )

    const transformedPosition = {
      id: updatedPosition.id,
      position: updatedPosition.position,
      companyId: updatedPosition.company,
      joiningDate: updatedPosition.joiningDate,
      endingDate: updatedPosition.endingDate,
      description: updatedPosition.description,
      jobType: updatedPosition.jobType,
      locationType: updatedPosition.locationType,
      skills: updatedPosition.skills,
      createdAt: updatedPosition.createdAt,
      updatedAt: updatedPosition.updatedAt,
      company: {
        id: updatedPosition.companyRef.id,
        name: updatedPosition.companyRef.name,
        logo: updatedPosition.companyRef.logo,
        website: updatedPosition.companyRef.website,
        location: updatedPosition.companyRef.location,
        createdAt: updatedPosition.companyRef.createdAt,
        updatedAt: updatedPosition.companyRef.updatedAt,
      }
    }

    const response = successResponseSchema.parse({
      success: true,
      message: "Position updated successfully",
      data: transformedPosition
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error updating position:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.issues
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to update position"
    }, { status: 500 })
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Unauthorized"
      })
      return NextResponse.json(response, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "User not found"
      })
      return NextResponse.json(response, { status: 404 })
    }

    const { id } = await params

    if (!id || typeof id !== 'string') {
      return NextResponse.json({
        success: false,
        error: "Invalid position ID"
      }, { status: 400 })
    }

    const position = await prisma.position.findUnique({
      where: { id },
      include: { companyRef: true }
    })

    if (!position) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Position not found"
      })
      return NextResponse.json(response, { status: 404 })
    }

    await prisma.position.delete({
      where: { id }
    })

    await createActivity(
      user.id,
      "Deleted",
      "User",
      position.id,
      position.position,
      `Deleted position: ${position.position} at ${position.companyRef.name}`,
      {
        position: position.position,
        jobType: position.jobType,
        company: position.companyRef.name,
        joiningDate: position.joiningDate,
        endingDate: position.endingDate,
        locationType: position.locationType,
        skillsCount: position.skills.length,
      }
    )

    const response = successResponseSchema.parse({
      success: true,
      message: "Position deleted successfully"
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error deleting position:", error)
    
    return NextResponse.json({
      success: false,
      error: "Failed to delete position"
    }, { status: 500 })
  }
} 