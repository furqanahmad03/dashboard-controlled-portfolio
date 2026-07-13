import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { certificationUpdateSchema } from "@/lib/validations"
import { replaceFileInCloudinary, deleteFileFromCloudinary } from "@/lib/cloudinary"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id || id === "undefined" || id === "null") {
      return NextResponse.json(
        { success: false, error: "Invalid certification ID" },
        { status: 400 }
      )
    }

    const certification = await prisma.certification.findUnique({
      where: { id }
    })

    if (!certification) {
      return NextResponse.json(
        { success: false, error: "Certification not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: certification
    })

  } catch (error) {
    console.error("Error fetching certification:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch certification" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    if (!id || id === "undefined" || id === "null") {
      return NextResponse.json(
        { success: false, error: "Invalid certification ID" },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const issuer = formData.get('issuer') as string
    const issuerWebsite = formData.get('issuerWebsite') as string
    const issueDate = formData.get('issueDate') as string
    const credentialID = formData.get('credentialID') as string
    let credentialURL = formData.get('credentialURL') as string
    const status = formData.get('status') as string
    
    const logoFile = formData.get('logo') as File | null
    const certificateFile = formData.get('certificate') as File | null
    
    const validationResult = certificationUpdateSchema.safeParse({ 
      title, 
      issuer, 
      issuerWebsite, 
      issueDate, 
      credentialID, 
      credentialURL, 
      status, 
      id 
    })

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const certificationData = validationResult.data

    const existingCertification = await prisma.certification.findUnique({
      where: { id }
    })

    if (!existingCertification) {
      return NextResponse.json(
        { success: false, error: "Certification not found" },
        { status: 404 }
      )
    }

    if (certificationData.title && certificationData.issuer) {
      const duplicateCertification = await prisma.certification.findFirst({
        where: {
          title: certificationData.title,
          issuer: certificationData.issuer,
          id: { not: id }
        }
      })

      if (duplicateCertification) {
        return NextResponse.json(
          { success: false, error: "A certification with this title and issuer already exists" },
          { status: 409 }
      )
    }
    }

    let logoUrl = existingCertification.logo
    let certificateLogoPublicId = existingCertification.certificateLogoPublicId
    
    if (logoFile) {
      try {
        const uploadResult = await replaceFileInCloudinary(
          logoFile,
          certificateLogoPublicId || "",
          { folder: "certificate-logo" }
        )
        logoUrl = uploadResult.url
        certificateLogoPublicId = uploadResult.publicId
      } catch (error) {
        console.error("Error replacing logo:", error)
        return NextResponse.json(
          { success: false, error: "Failed to replace logo" },
          { status: 500 }
        )
      }
    }

    let certificateUrl = existingCertification.certificate
    let certificatePublicId = existingCertification.certificatePublicId
    
    if (credentialURL && existingCertification.certificate) {
      try {
        if (existingCertification.certificatePublicId) {
          await deleteFileFromCloudinary(existingCertification.certificatePublicId)
        }
        certificateUrl = null
        certificatePublicId = null
      } catch (error) {
        console.error("Error deleting existing certificate:", error)
      }
    }
    
    if (certificateFile) {
      try {
        const uploadResult = await replaceFileInCloudinary(
          certificateFile,
          certificatePublicId || "",
          { folder: "certificates" }
        )
        certificateUrl = uploadResult.url
        certificatePublicId = uploadResult.publicId
        
        if (credentialURL) {
          credentialURL = ""
        }
      } catch (error) {
        console.error("Error replacing certificate:", error)
        return NextResponse.json(
          { success: false, error: "Failed to replace certificate" },
          { status: 500 }
        )
      }
    }


    const updatedCertification = await prisma.certification.update({
      where: { id },
      data: {
        title: certificationData.title,
        issuer: certificationData.issuer,
        logo: logoUrl,
        certificateLogoPublicId: certificateLogoPublicId,
        issuerWebsite: certificationData.issuerWebsite,
        issueDate: certificationData.issueDate,
        credentialID: certificationData.credentialID,
        credentialURL: certificationData.credentialURL,
        certificate: certificateUrl,
        certificatePublicId: certificatePublicId,
        status: certificationData.status
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedCertification,
      message: "Certification updated successfully"
    })

  } catch (error) {
    console.error("Error updating certification:", error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to update certification" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    if (!id || id === "undefined" || id === "null") {
      return NextResponse.json(
        { success: false, error: "Invalid certification ID" },
        { status: 400 }
      )
    }

    const existingCertification = await prisma.certification.findUnique({
      where: { id }
    })

    if (!existingCertification) {
      return NextResponse.json(
        { success: false, error: "Certification not found" },
        { status: 404 }
      )
    }

    if (existingCertification.certificateLogoPublicId) {
      try {
        await deleteFileFromCloudinary(existingCertification.certificateLogoPublicId)
      } catch (error) {
        console.error("Error deleting logo from Cloudinary:", error)
      }
    }

    if (existingCertification.certificatePublicId) {
      try {
        await deleteFileFromCloudinary(existingCertification.certificatePublicId)
      } catch (error) {
        console.error("Error deleting certificate from Cloudinary:", error)
      }
    }
    
    await prisma.certification.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Certification deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting certification:", error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to delete certification" },
      { status: 500 }
    )
  }
} 