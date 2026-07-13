import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { companyUpdateSchema, successResponseSchema, errorResponseSchema } from "@/lib/validations"
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
        error: "Invalid company ID"
      })
      return NextResponse.json(response, { status: 400 })
    }
    
    const company = await prisma.company.findUnique({
      where: { id: id }
    })
    
    if (!company) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Company not found"
      })
      return NextResponse.json(response, { status: 404 })
    }
    
    const response = successResponseSchema.parse({
      success: true,
      message: "Company fetched successfully",
      data: company
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching company:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.issues
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to fetch company"
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
    
    if (!id || typeof id !== 'string') {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Invalid company ID"
      })
      return NextResponse.json(response, { status: 400 })
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
      companyUpdateSchema.parse(companyData)
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

    const existingCompany = await prisma.company.findUnique({
      where: { id: id }
    })

    if (!existingCompany) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Company not found"
      })
      return NextResponse.json(response, { status: 404 })
    }

    let logoUrl = existingCompany.logo
    let logoPublicId = existingCompany.logoPublicId

    if (logoFile) {
      try {
        const { replaceFileInCloudinary } = await import("@/lib/cloudinary")
        const oldLogoIdentifier = existingCompany.logoPublicId || existingCompany.logo || ""
        const uploadResult = await replaceFileInCloudinary(logoFile, oldLogoIdentifier, {
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

    const company = await prisma.company.update({
      where: { id: id },
      data: {
        ...companyData,
        logo: logoUrl,
        logoPublicId: logoPublicId
      }
    })

    await createActivity(
      user.id,
      "Updated",
      "User",
      company.id,
      company.name,
      `Updated company: ${company.name}`,
      {
        name: company.name,
        website: company.website,
        location: company.location,
        hasLogo: !!company.logo,
      }
    )

    const response = successResponseSchema.parse({
      success: true,
      message: "Company updated successfully",
      data: company
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error updating company:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.issues
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to update company"
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
        error: "Invalid company ID"
      })
      return NextResponse.json(response, { status: 400 })
    }
    
    const existingCompany = await prisma.company.findUnique({
      where: { id: id }
    })

    if (!existingCompany) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Company not found"
      })
      return NextResponse.json(response, { status: 404 })
    }

    if (existingCompany.logo || existingCompany.logoPublicId) {
      const { deleteFileFromCloudinary } = await import("@/lib/cloudinary")
      await deleteFileFromCloudinary(existingCompany.logoPublicId || existingCompany.logo || "")
    }

    await createActivity(
      user.id,
      "Deleted",
      "User",
      existingCompany.id,
      existingCompany.name,
      `Deleted company: ${existingCompany.name}`,
      {
        name: existingCompany.name,
        website: existingCompany.website,
        location: existingCompany.location,
        hasLogo: !!existingCompany.logo,
        logoCleaned: !!existingCompany.logoPublicId || !!existingCompany.logo,
      }
    )


    await prisma.company.delete({
      where: { id: id }
    })

    const response = successResponseSchema.parse({
      success: true,
      message: "Company deleted successfully"
    })

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error("Error deleting company:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.issues
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: "Failed to delete company"
    }, { status: 500 })
  }
} 