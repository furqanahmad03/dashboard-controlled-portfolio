import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { companySchema, successResponseSchema, errorResponseSchema } from "@/lib/validations"
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
    const companies = await prisma.company.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })
    
    const response = successResponseSchema.parse({
      success: true,
      message: "Companies fetched successfully",
      data: companies
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching companies:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.issues
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to fetch companies"
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
    
    const name = formData.get("name") as string
    const website = formData.get("website") as string
    const location = formData.get("location") as string
    const logoFile = formData.get("logo") as File | null

    const companyData = {
      name,
      website: website || undefined,
      location: location || undefined,
    }

    try {
      companySchema.parse(companyData)
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
          folder: "company-logos"
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


    const company = await prisma.company.create({
      data: {
        ...companyData,
        logo: logoUrl,
        logoPublicId: logoPublicId
      }
    })

    await createActivity(
      user.id,
      "Created",
      "User",
      company.id,
      company.name,
      `Created company: ${company.name}`,
      {
        name: company.name,
        website: company.website,
        location: company.location,
        hasLogo: !!company.logo,
      }
    )

    const response = successResponseSchema.parse({
      success: true,
      message: "Company created successfully",
      data: company
    })

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating company:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.issues
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to create company"
    }, { status: 500 })
  }
} 