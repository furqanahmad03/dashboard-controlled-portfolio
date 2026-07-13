import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { educationSchema, successResponseSchema, errorResponseSchema } from "@/lib/validations"
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
    const educations = await prisma.education.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })
    
    const response = successResponseSchema.parse({
      success: true,
      message: "Educations fetched successfully",
      data: educations
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching educations:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.issues
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to fetch educations"
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

    const formData = await request.formData()
    
    const degree = formData.get("degree") as string
    const institution = formData.get("institution") as string
    const location = formData.get("location") as string
    const startDate = formData.get("startDate") as string
    const endDate = formData.get("endDate") as string
    const description = formData.get("description") as string
    const gpa = formData.get("gpa") as string
    const percentage = formData.get("percentage") as string
    const skills = formData.get("skills") as string
    const logoFile = formData.get("logo") as File | null

    const educationData = {
      degree,
      institution,
      location: location || undefined,
      startDate: new Date(startDate), // Ensure startDate is always a Date
      endDate: endDate ? new Date(endDate) : null,
      description: description || undefined,
      gpa: gpa || undefined,
      percentage: percentage || undefined,
      skills: skills ? JSON.parse(skills) : [],
    }

    try {
      educationSchema.parse(educationData)
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

    let logoUrl = null
    let logoPublicId = null
    
    if (logoFile) {
      try {
        const { uploadFileToCloudinary } = await import("@/lib/cloudinary")
        const uploadResult = await uploadFileToCloudinary(logoFile, {
          folder: "education-logos"
        })
        
        logoUrl = uploadResult.url
        logoPublicId = uploadResult.publicId
      } catch (uploadError) {
        console.error("Error uploading logo:", uploadError)
        return NextResponse.json({
          success: false,
          error: "Failed to upload logo"
        }, { status: 500 })
      }
    }

    const education = await prisma.education.create({
      data: {
        ...educationData,
        institutionLogo: logoUrl,
        institutionLogoPublicId: logoPublicId
      }
    })

    await createActivity(
      user.id,
      "Created",
      "Education",
      education.id,
      education.institution,
      `Created education: ${education.degree} from ${education.institution}`,
      {
        degree: education.degree,
        institution: education.institution,
        location: education.location,
        startDate: education.startDate,
        endDate: education.endDate,
        hasLogo: !!education.institutionLogo,
        logoUploaded: logoFile !== null,
        skillsCount: education.skills.length,
      }
    )

    const response = successResponseSchema.parse({
      success: true,
      message: "Education created successfully",
      data: education
    })

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating education:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.issues
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to create education entry"
    }, { status: 500 })
  }
} 