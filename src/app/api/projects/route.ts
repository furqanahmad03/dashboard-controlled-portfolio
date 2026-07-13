import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { uploadFileToCloudinary } from "@/lib/cloudinary"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { successResponseSchema, errorResponseSchema, projectFormDataSchema } from "@/lib/validations"
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


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const isAuthenticated = !!session?.user?.email

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const featured = searchParams.get('featured')

    const whereClause: { isEnabled?: boolean; featured?: boolean } = isAuthenticated ? {} : { isEnabled: true }
    
    if (featured === 'true') {
      whereClause.featured = true
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc"
      },
      take: limit ? parseInt(limit) : undefined,
      include: {
        education: { select: { institution: true, institutionLogo: true } },
        company: { select: { name: true, logo: true } },
        certification: { select: { title: true, logo: true } },
        client: { select: { name: true } }
      }
    })
    
    // Modify client names based on authentication status
    const modifiedProjects = projects.map(project => ({
      ...project,
      client: project.client ? {
        ...project.client,
        name: isAuthenticated ? project.client.name : "Client"
      } : null
    }))
    
    const response = successResponseSchema.parse({
      success: true,
      message: isAuthenticated 
        ? "All projects fetched successfully" 
        : "Enabled projects fetched successfully",
      data: modifiedProjects
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching projects:", error)
    
    if (error instanceof z.ZodError) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Validation error",
        details: (error as z.ZodError).issues
      })
      return NextResponse.json(response, { status: 400 })
    }
    
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to fetch projects"
    })
    return NextResponse.json(response, { status: 500 })
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
    
    const formDataObj = {
      slug: formData.get("slug") as string,
      title: formData.get("title") as string,
      brief: formData.get("brief") as string,
      overview: formData.get("overview") as string,
      repository: formData.get("repository") as string,
      live: formData.get("live") as string,
      associatedWith: formData.get("associatedWith") as string,
      status: formData.get("status") as string,
      startDate: formData.get("startDate") ? new Date(formData.get("startDate") as string) : undefined,
      endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : undefined,
      stack: formData.get("stack") as string,
      features: formData.get("features") as string,
      category: formData.get("category") as string,
      featured: formData.get("featured") === "true",
      hasCaseStudy: formData.get("hasCaseStudy") === "true",
    }
    
    const clientInfoStr = formData.get("clientInfo") as string
    let clientInfo = null
    if (clientInfoStr) {
      try {
        clientInfo = JSON.parse(clientInfoStr)
      } catch (error) {
        console.error("Error parsing client info:", error)
      }
    }
    
    const thumbnailFile = formData.get("thumbnail") as File | null
    const carouselFiles = formData.getAll("carousel") as File[]

    const validationResult = projectFormDataSchema.safeParse(formDataObj)
    if (!validationResult.success) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Validation error",
        details: validationResult.error.issues
      })
      return NextResponse.json(response, { status: 400 })
    }

    const validatedData = validationResult.data
    
    const existingProject = await prisma.project.findFirst({
      where: { slug: validatedData.slug.trim() }
    })
    
    if (existingProject) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Slug already exists",
        message: `A project with slug "${validatedData.slug}" already exists. Please choose a different slug.`
      })
      return NextResponse.json(response, { status: 400 })
    }

    if (!thumbnailFile) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Thumbnail required",
        message: "Project thumbnail is mandatory"
      })
      return NextResponse.json(response, { status: 400 })
    }

    let thumbnailUrl = null
    const carouselUrls: string[] = []

    let thumbnailPublicId: string | null = null
    if (thumbnailFile) {
      try {
        const uploadResult = await uploadFileToCloudinary(thumbnailFile, { folder: "project-thumbnails" })
        thumbnailUrl = uploadResult.url
        thumbnailPublicId = uploadResult.publicId
      } catch (uploadError) {
        console.error("Error uploading thumbnail:", uploadError)
        const response = errorResponseSchema.parse({
          success: false,
          error: "Failed to upload thumbnail"
        })
        return NextResponse.json(response, { status: 500 })
      }
    }

    const carouselPublicIds: string[] = []
    if (carouselFiles.length > 0) {
      try {
        for (const file of carouselFiles) {
          const uploadResult = await uploadFileToCloudinary(file, { folder: "project-carousel" })
          carouselUrls.push(uploadResult.url)
          carouselPublicIds.push(uploadResult.publicId)
        }
      } catch (uploadError) {
        console.error("Error uploading carousel images:", uploadError)
        const response = errorResponseSchema.parse({
          success: false,
          error: "Failed to upload carousel images"
        })
        return NextResponse.json(response, { status: 500 })
      }
    }

    // Handle associatedWith field - use ID directly or create client
    let associatedWithId: string | null = null;
    
    if (validatedData.associatedWith && validatedData.associatedWith !== "") {
      if (validatedData.associatedWith === "client") {
        // Create a new client if client info is provided
        if (clientInfo && clientInfo.name) {
          const newClient = await prisma.client.create({
            data: {
              name: clientInfo.name || null,
              phone: clientInfo.phone || null,
              email: clientInfo.email || null,
              city: clientInfo.city || null,
              state: clientInfo.state || null,
              country: clientInfo.country || null,
              company: clientInfo.company || null,
              industry: clientInfo.industry || null,
              budget: clientInfo.budget || null,
              sourceName: clientInfo.sourceName || null,
              sourceWebsite: clientInfo.sourceWebsite || null,
              notes: clientInfo.notes || null,
            }
          });
          associatedWithId = newClient.id;
        }
      } else {
        // Use the ID directly (for companies, certifications, education)
        associatedWithId = validatedData.associatedWith;
      }
    }

    const project = await prisma.project.create({
      data: {
        slug: validatedData.slug,
        title: validatedData.title,
        brief: validatedData.brief,
        thumbnail: thumbnailUrl || "",
        thumbnailPublicId,
        images: carouselUrls,
        imagePublicIds: carouselPublicIds,
        stack: validatedData.stack ? JSON.parse(validatedData.stack) : [],
        repository: validatedData.repository || "",
        live: validatedData.live || "",
        category: validatedData.category ? JSON.parse(validatedData.category) : [],
        associatedWith: associatedWithId,
        overview: validatedData.overview,
        features: validatedData.features ? JSON.parse(validatedData.features) : [],
        status: validatedData.status,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate || null,
        featured: validatedData.featured,
        hasCaseStudy: validatedData.hasCaseStudy,
        isEnabled: true
      }
    })

    const projectWithRelations = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        education: true,
        company: true,
        certification: true,
        client: true
      }
    })

    await createActivity(
      user.id,
      "Created",
      "Project",
      project.id,
      project.title,
      `Created new project: ${project.title}`
    )

    const response = successResponseSchema.parse({
      success: true,
      message: "Project created successfully",
      data: projectWithRelations
    })

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    
    if (error instanceof z.ZodError) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Validation error",
        details: (error as z.ZodError).issues
      })
      return NextResponse.json(response, { status: 400 })
    }
    
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to create project"
    })
    return NextResponse.json(response, { status: 500 })
  }
} 