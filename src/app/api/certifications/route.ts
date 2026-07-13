import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { certificationSchema } from "@/lib/validations"
import { uploadFileToCloudinary } from "@/lib/cloudinary"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')

    const certifications = await prisma.certification.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined
    })

    return NextResponse.json({
      success: true,
      data: certifications
    })
  } catch (error) {
    console.error("Error fetching certifications:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch certifications" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const issuer = formData.get('issuer') as string
    const issuerWebsite = formData.get('issuerWebsite') as string
    const issueDate = formData.get('issueDate') as string
    const credentialID = formData.get('credentialID') as string
    const credentialURL = formData.get('credentialURL') as string
    const status = formData.get('status') as string
    
    const logoFile = formData.get('logo') as File | null
    const certificateFile = formData.get('certificate') as File | null
    
    if (!title || !issuer || !issueDate) {
      return NextResponse.json(
        { success: false, error: "Title, issuer, and issue date are required" },
        { status: 400 }
      )
    }

    const validationResult = certificationSchema.safeParse({
      title,
      issuer,
      issuerWebsite,
      issueDate,
      credentialID,
      credentialURL,
      status
    })
    
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const certificationData = validationResult.data

    const existingCertification = await prisma.certification.findFirst({
      where: {
        title: certificationData.title,
        issuer: certificationData.issuer
      }
    })

    if (existingCertification) {
      return NextResponse.json(
        { success: false, error: "A certification with this title and issuer already exists" },
        { status: 409 }
      )
    }

    let logoUrl = null
    let certificateLogoPublicId = null
    
    if (logoFile) {
      try {
        const uploadResult = await uploadFileToCloudinary(
          logoFile,
          { folder: "certificate-logo" }
        )
        logoUrl = uploadResult.url
        certificateLogoPublicId = uploadResult.publicId
      } catch (error) {
        console.error("Error uploading logo:", error)
        return NextResponse.json(
          { success: false, error: "Failed to upload logo" },
          { status: 500 }
        )
      }
    }

    let certificateUrl = null
    let certificatePublicId = null
    
    if (certificateFile) {
      try {
        const uploadResult = await uploadFileToCloudinary(
          certificateFile,
          { folder: "certificates" }
        )
        certificateUrl = uploadResult.url
        certificatePublicId = uploadResult.publicId
      } catch (error) {
        console.error("Error uploading certificate:", error)
        return NextResponse.json(
          { success: false, error: "Failed to upload certificate" },
          { status: 500 }
        )
      }
    }
  
    const newCertification = await prisma.certification.create({
      data: {
        title: certificationData.title,
        issuer: certificationData.issuer,
        logo: logoUrl,
        certificateLogoPublicId: certificateLogoPublicId,
        issuerWebsite: certificationData.issuerWebsite || null,
        issueDate: certificationData.issueDate,
        credentialID: certificationData.credentialID || null,
        credentialURL: certificationData.credentialURL || null,
        certificate: certificateUrl,
        certificatePublicId: certificatePublicId,
        status: certificationData.status
      }
    })

    return NextResponse.json({
      success: true,
      data: newCertification,
      message: "Certification created successfully"
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating certification:", error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to create certification" },
      { status: 500 }
    )
  }
} 