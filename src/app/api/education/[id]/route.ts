import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { educationUpdateSchema, successResponseSchema, errorResponseSchema } from "@/lib/validations"
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
      const response = errorResponseSchema.parse({
        success: false,
        error: "Invalid education ID"
      })
      return NextResponse.json(response, { status: 400 })
    }

    const education = await prisma.education.findUnique({
      where: {
        id: id
      }
    })

    if (!education) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Education not found"
      })
      return NextResponse.json(response, { status: 404 })
    }

    const response = successResponseSchema.parse({
      success: true,
      message: "Education fetched successfully",
      data: education
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching education:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.issues
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to fetch education"
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

    const formData = await request.formData()
    const { id } = await params
    
    if (!id || typeof id !== 'string') {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Invalid education ID"
      })
      return NextResponse.json(response, { status: 400 })
    }

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
      id,
      degree,
      institution,
      location: location || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : null,
      description: description || undefined,
      gpa: gpa || undefined,
      percentage: percentage || undefined,
      skills: skills ? JSON.parse(skills) : [],
    }

    try {
      educationUpdateSchema.parse(educationData)
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

    const existingEducation = await prisma.education.findUnique({
      where: { id: id }
    })

    if (!existingEducation) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Education not found"
      })
      return NextResponse.json(response, { status: 404 })
    }

    let logoUrl = existingEducation.institutionLogo
    let logoPublicId = existingEducation.institutionLogoPublicId

    if (logoFile) {
      try {
        const { replaceFileInCloudinary } = await import("@/lib/cloudinary")
        const oldLogoIdentifier = existingEducation.institutionLogoPublicId || existingEducation.institutionLogo || ""
        const uploadResult = await replaceFileInCloudinary(logoFile, oldLogoIdentifier, {
          folder: "education-logos"
        })
        
        logoUrl = uploadResult.url
        logoPublicId = uploadResult.publicId
      } catch (uploadError) {
        console.error("Error uploading logo:", uploadError)
        const response = errorResponseSchema.parse({
          success: false,
          error: "Failed to upload logo"
        })
        return NextResponse.json(response, { status: 500 })
      }
    }

    const education = await prisma.education.update({
      where: { id: id },
      data: {
        degree,
        institution,
        location: location || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description: description || null,
        gpa: gpa || null,
        percentage: percentage || null,
        skills: skills ? JSON.parse(skills) : [],
        institutionLogo: logoUrl,
        institutionLogoPublicId: logoPublicId
      }
    })

    await createActivity(
      user.id,
      "Updated",
      "Education",
      education.id,
      education.institution,
      `Updated education: ${education.degree} from ${education.institution}`,
      {
        degree: education.degree,
        institution: education.institution,
        location: education.location,
        startDate: education.startDate,
        endDate: education.endDate,
        hasLogo: !!education.institutionLogo,
        logoUpdated: logoFile !== null,
        skillsCount: education.skills.length,
      }
    )

    const response = successResponseSchema.parse({
      success: true,
      message: "Education updated successfully",
      data: education
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error updating education:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.issues
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to update education entry"
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
      const response = errorResponseSchema.parse({
        success: false,
        error: "Invalid education ID"
      })
      return NextResponse.json(response, { status: 400 })
    }

    const existingEducation = await prisma.education.findUnique({
      where: { id: id }
    })

    if (!existingEducation) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Education not found"
      })
      return NextResponse.json(response, { status: 404 })
    }

    if (existingEducation.institutionLogo || existingEducation.institutionLogoPublicId) {
      const { deleteFileFromCloudinary } = await import("@/lib/cloudinary")
      await deleteFileFromCloudinary(existingEducation.institutionLogoPublicId || existingEducation.institutionLogo || "")
    }

    await createActivity(
      user.id,
      "Deleted",
      "Education",
      existingEducation.id,
      existingEducation.institution,
      `Deleted education: ${existingEducation.degree} from ${existingEducation.institution}`,
      {
        degree: existingEducation.degree,
        institution: existingEducation.institution,
        location: existingEducation.location,
        startDate: existingEducation.startDate,
        endDate: existingEducation.endDate,
        hasLogo: !!existingEducation.institutionLogo,
        logoCleaned: !!existingEducation.institutionLogoPublicId,
        skillsCount: existingEducation.skills.length,
      }
    )

    await prisma.education.delete({
      where: { id: id }
    })

    const response = successResponseSchema.parse({
      success: true,
      message: "Education deleted successfully"
    })

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error("Error deleting education:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.issues
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to delete education entry"
    }, { status: 500 })
  }
} 