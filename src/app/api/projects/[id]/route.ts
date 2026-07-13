import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { uploadFileToCloudinary, replaceFileInCloudinary, batchDeleteFromCloudinary } from "@/lib/cloudinary"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { successResponseSchema, errorResponseSchema, projectUpdateFormDataSchema } from "@/lib/validations"


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
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Unauthorized",
        message: "Authentication required to access project details"
      })
      return NextResponse.json(response, { status: 401 })
    }

    const { id } = await params
    
    const project = await prisma.project.findUnique({
      where: { id: id },
      include: {
        education: { select: { institution: true } },
        company: { select: { name: true } },
        certification: { select: { title: true } },
        client: { 
          select: { 
            id: true,
            name: true,
            phone: true,
            email: true,
            city: true,
            state: true,
            country: true,
            company: true,
            industry: true,
            budget: true,
            sourceName: true,
            sourceWebsite: true,
            notes: true
          } 
        }
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
    
    const response = successResponseSchema.parse({
      success: true,
      message: "Project fetched successfully",
      data: project
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching project:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to fetch project",
      message: "An error occurred while fetching the project"
    })
    return NextResponse.json(response, { status: 500 })
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
    const formData = await request.formData()
    
    const formDataObj = {
      id,
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
    
    const thumbnailFile = formData.get("thumbnail") as File | null
    const carouselFiles = formData.getAll("carousel") as File[]
    const imagesToDelete = formData.get("imagesToDelete") as string
    
    const clientInfoStr = formData.get("clientInfo") as string
    let clientInfo = null
    if (clientInfoStr) {
      try {
        clientInfo = JSON.parse(clientInfoStr)
        console.log("Client info:", clientInfo)
      } catch (error) {
        console.error("Error parsing client info:", error)
      }
    }

    const validationResult = projectUpdateFormDataSchema.safeParse(formDataObj)
    if (!validationResult.success) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Validation error",
        details: validationResult.error.issues
      })
      return NextResponse.json(response, { status: 400 })
    }

    const validatedData = validationResult.data
    
    // Handle associatedWith field - use ID directly or create/update client
    let associatedWithId: string | null = null;
    
    if (validatedData.associatedWith && validatedData.associatedWith !== "") {
      if (validatedData.associatedWith === "client") {
        // Handle client association
        if (clientInfo && clientInfo.name) {
          // Check if project already has a client associated
          const currentProject = await prisma.project.findUnique({
            where: { id: id },
            select: { associatedWith: true }
          });
          
          if (currentProject?.associatedWith) {
            // Check if the associated entity is a client
            const existingClient = await prisma.client.findUnique({
              where: { id: currentProject.associatedWith }
            });
            
            if (existingClient) {
              // Update existing client
              const updatedClient = await prisma.client.update({
                where: { id: existingClient.id },
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
              associatedWithId = updatedClient.id;
            } else {
              // Create new client if associated entity is not a client
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
            // No existing association, create new client
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
        }
      } else {
        // Use the ID directly (for companies, certifications, education)
        associatedWithId = validatedData.associatedWith;
      }
    }
    
    const existingProject = await prisma.project.findFirst({
      where: { 
        slug: validatedData.slug.trim(),
        id: { not: id }
      }
    })
    
    if (existingProject) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Slug already exists",
        message: `A project with slug "${validatedData.slug}" already exists. Please choose a different slug.`
      })
      return NextResponse.json(response, { status: 400 })
    }

    const currentProject = await prisma.project.findUnique({
      where: { id: id }
    })

    if (!currentProject) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Project not found",
        message: "The project you're trying to update could not be found"
      })
      return NextResponse.json(response, { status: 404 })
    }

    let thumbnailUrl = currentProject.thumbnail
    let carouselUrls = currentProject.images
    let thumbnailPublicId = currentProject.thumbnailPublicId
    let carouselPublicIds = currentProject.imagePublicIds || []

    if (thumbnailFile) {
      try {
        console.log("Replacing existing thumbnail")
        const replaceResult = await replaceFileInCloudinary(
          thumbnailFile,
          currentProject.thumbnail,
          { folder: "project-thumbnails" }
        )
        thumbnailUrl = replaceResult.url
        thumbnailPublicId = replaceResult.publicId
        console.log("✅ Thumbnail replaced successfully")
      } catch (error) {
        console.error("Error with thumbnail:", error)
        const response = errorResponseSchema.parse({
          success: false,
          error: "Thumbnail error",
          message: "Failed to process thumbnail"
        })
        return NextResponse.json(response, { status: 500 })
      }
    }
    
    if (imagesToDelete) {
      try {
        console.log("Processing carousel image deletions:", imagesToDelete)
        const imagesToDeleteArray = JSON.parse(imagesToDelete) as string[]
        console.log("Images to delete:", imagesToDeleteArray)
        
        const publicIdsToDelete: string[] = []
        const urlsToDelete: string[] = []
        
        for (const imageUrl of imagesToDeleteArray) {
          const imageIndex = currentProject.images.indexOf(imageUrl)
          if (imageIndex !== -1 && currentProject.imagePublicIds?.[imageIndex]) {
            publicIdsToDelete.push(currentProject.imagePublicIds[imageIndex])
          } else {
            urlsToDelete.push(imageUrl)
          }
        }
        
        if (publicIdsToDelete.length > 0) {
          console.log(`Batch deleting ${publicIdsToDelete.length} images by public ID`)
          const deleteResults = await batchDeleteFromCloudinary(publicIdsToDelete)
          console.log(`✅ Batch deleted: ${deleteResults.success.length} success, ${deleteResults.failed.length} failed`)
        }
        
        carouselUrls = carouselUrls.filter(img => !imagesToDeleteArray.includes(img))
        carouselPublicIds = carouselPublicIds.filter((_, index) => 
          !imagesToDeleteArray.includes(currentProject.images[index])
        )
        
        console.log("✅ Carousel images deleted successfully")
        console.log("Updated carousel URLs:", carouselUrls)
        console.log("Updated carousel Public IDs:", carouselPublicIds)
      } catch (deleteError) {
        console.error("Error deleting carousel images:", deleteError)
      }
    }
    
    if (carouselFiles.length > 0) {
      try {
        console.log("Processing new carousel image uploads:", carouselFiles.length)
        const newCarouselUrls: string[] = []
        const newCarouselPublicIds: string[] = []
        
        for (const file of carouselFiles) {
          const uploadResult = await uploadFileToCloudinary(file, { folder: "project-carousel" })
          newCarouselUrls.push(uploadResult.url)
          newCarouselPublicIds.push(uploadResult.publicId)
          console.log(`✅ Uploaded carousel image: ${file.name}`)
        }
        
        carouselUrls = [...carouselUrls, ...newCarouselUrls]
        carouselPublicIds = [...carouselPublicIds, ...newCarouselPublicIds]
        
        console.log("✅ New carousel images uploaded successfully")
        console.log("Final carousel URLs:", carouselUrls)
        console.log("Final carousel public IDs:", carouselPublicIds)
      } catch (uploadError) {
        console.error("Error uploading carousel images:", uploadError)
        const response = errorResponseSchema.parse({
          success: false,
          error: "Upload failed",
          message: "Failed to upload carousel images"
        })
        return NextResponse.json(response, { status: 500 })
      }
    }

    console.log("📊 Final project update summary:")
    console.log(`- Thumbnail: ${thumbnailUrl || "None"}`)
    console.log(`- Thumbnail Public ID: ${thumbnailPublicId || "None"}`)
    console.log(`- Carousel Images: ${carouselUrls.length} images`)
    console.log(`- Carousel Public IDs: ${carouselPublicIds.length} IDs`)
    console.log(`- Featured: ${validatedData.featured}`)

    const project = await prisma.project.update({
      where: { id: id },
      data: {
        slug: validatedData.slug,
        title: validatedData.title,
        brief: validatedData.brief,
        overview: validatedData.overview,
        repository: validatedData.repository || "",
        live: validatedData.live || "",
        associatedWith: associatedWithId,
        status: validatedData.status,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate || null,
        thumbnail: thumbnailUrl,
        thumbnailPublicId,
        images: carouselUrls,
        imagePublicIds: carouselPublicIds,
        stack: validatedData.stack ? JSON.parse(validatedData.stack) : [],
        features: validatedData.features ? JSON.parse(validatedData.features) : [],
        category: validatedData.category ? JSON.parse(validatedData.category) : [],
        featured: validatedData.featured,
        hasCaseStudy: validatedData.hasCaseStudy,
      }
    })

    console.log("✅ Project updated successfully in database")

    await createActivity(
      user.id,
      "Updated",
      "Project",
      project.id,
      project.title,
      `Updated project: ${project.title}`,
      {
        title: project.title,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        hasThumbnail: !!project.thumbnail,
        carouselImagesCount: project.images.length,
        stackCount: project.stack.length,
        featuresCount: project.features.length,
        categoryCount: project.category.length,
        associatedWith: project.associatedWith,
      }
    )

    const updatedProjectWithRelations = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        education: { select: { institution: true, institutionLogo: true } },
        company: { select: { name: true, logo: true } },
        certification: { select: { title: true, logo: true } },
        client: { 
          select: { 
            id: true,
            name: true,
            phone: true,
            email: true,
            city: true,
            state: true,
            country: true,
            company: true,
            industry: true,
            budget: true,
            sourceName: true,
            sourceWebsite: true,
            notes: true
          } 
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      data: updatedProjectWithRelations
    })
  } catch (error) {
    console.error("Error updating project:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Update failed",
      message: "Failed to update project"
    })
    return NextResponse.json(response, { status: 500 })
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
    
    const existingProject = await prisma.project.findUnique({
      where: { id: id }
    })

    if (!existingProject) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Project not found",
        message: "The project you're trying to delete could not be found"
      })
      return NextResponse.json(response, { status: 404 })
    }

    await createActivity(
      user.id,
      "Deleted",
      "Project",
      existingProject.id,
      existingProject.title,
      `Deleted project: ${existingProject.title}`,
      {
        title: existingProject.title,
        status: existingProject.status,
        startDate: existingProject.startDate,
        endDate: existingProject.endDate,
        hasThumbnail: !!existingProject.thumbnail,
        carouselImagesCount: existingProject.images.length,
        stackCount: existingProject.stack.length,
        featuresCount: existingProject.features.length,
        categoryCount: existingProject.category.length,
        associatedWith: existingProject.associatedWith,
      }
    )

    try {
      const imagesToDelete: string[] = []
      
      if (existingProject.thumbnail) {
        imagesToDelete.push(existingProject.thumbnail)
      }
      
      if (existingProject.images && existingProject.images.length > 0) {
        imagesToDelete.push(...existingProject.images)
      }
      
      if (imagesToDelete.length > 0) {
        const deleteResults = await batchDeleteFromCloudinary(imagesToDelete)
        console.log(`Deleted ${deleteResults.success.length} images, ${deleteResults.failed.length} failed`)
      }
    } catch (deleteError) {
      console.error("Error deleting images from Cloudinary:", deleteError)
    }

    await prisma.project.delete({
      where: { id: id }
    })

    const response = successResponseSchema.parse({
      success: true,
      message: "Project deleted successfully",
      data: null
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error deleting project:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Deletion failed",
      message: "Failed to delete project"
    })
    
    return NextResponse.json(response, { status: 500 })
  }
} 