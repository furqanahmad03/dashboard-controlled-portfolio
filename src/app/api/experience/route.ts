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


export async function GET() {
  try {
    const positions = await prisma.position.findMany({
      include: {
        companyRef: true
      }
    })
    
    // Custom sorting logic:
    // 1. First, experiences without end date (current positions) sorted by start date desc
    // 2. Then, experiences with end date sorted by end date desc
    const sortedPositions = positions.sort((a, b) => {
      // If both have no end date, sort by joining date desc
      if (!a.endingDate && !b.endingDate) {
        return new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime()
      }
      
      // If only 'a' has no end date, 'a' comes first
      if (!a.endingDate && b.endingDate) {
        return -1
      }
      
      // If only 'b' has no end date, 'b' comes first
      if (a.endingDate && !b.endingDate) {
        return 1
      }
      
      // If both have end dates, sort by end date desc
      return new Date(b.endingDate!).getTime() - new Date(a.endingDate!).getTime()
    })

    const transformedPositions = sortedPositions.map(position => ({
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
    }))
    
    const response = successResponseSchema.parse({
      success: true,
      message: "Positions fetched successfully",
      data: transformedPositions
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching positions:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.issues
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to fetch positions"
    }, { status: 500 })
  }
}


export async function POST(request: NextRequest) {
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

    const body = await request.json()
    

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


    const newPosition = await prisma.position.create({
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
      "Created",
      "User",
      newPosition.id,
      newPosition.position,
      `Created position: ${newPosition.position} at ${newPosition.companyRef.name}`,
      {
        position: newPosition.position,
        jobType: newPosition.jobType,
        company: newPosition.companyRef.name,
        joiningDate: newPosition.joiningDate,
        endingDate: newPosition.endingDate,
        locationType: newPosition.locationType,
        skillsCount: newPosition.skills.length,
      }
    )


    const transformedPosition = {
      id: newPosition.id,
      position: newPosition.position,
      companyId: newPosition.company,
      joiningDate: newPosition.joiningDate,
      endingDate: newPosition.endingDate,
      description: newPosition.description,
      jobType: newPosition.jobType,
      locationType: newPosition.locationType,
      skills: newPosition.skills,
      createdAt: newPosition.createdAt,
      updatedAt: newPosition.updatedAt,
      company: {
        id: newPosition.companyRef.id,
        name: newPosition.companyRef.name,
        logo: newPosition.companyRef.logo,
        website: newPosition.companyRef.website,
        location: newPosition.companyRef.location,
        createdAt: newPosition.companyRef.createdAt,
        updatedAt: newPosition.companyRef.updatedAt,
      }
    }

    const response = successResponseSchema.parse({
      success: true,
      message: "Position created successfully",
      data: transformedPosition
    })

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating position:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.issues
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to create position"
    }, { status: 500 })
  }
} 