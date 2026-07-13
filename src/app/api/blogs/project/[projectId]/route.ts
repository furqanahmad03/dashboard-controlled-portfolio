import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { deleteFileFromCloudinary } from "@/lib/cloudinary"
import { blogSchema, errorResponseSchema, successResponseSchema } from "@/lib/validations"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const { searchParams } = new URL(request.url)
    const isPublic = searchParams.get("public") === "true"
    const caseStudyOnly = searchParams.get("caseStudy") === "true"

    if (!isPublic) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.email) {
        const response = errorResponseSchema.parse({
          success: false,
          error: "Unauthorized",
        })
        return NextResponse.json(response, { status: 401 })
      }
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        slug: true,
        title: true,
        hasCaseStudy: true,
      },
    })

    if (!project) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Project not found",
      })
      return NextResponse.json(response, { status: 404 })
    }

    const whereClause: {
      projectId: string
      state?: "ACTIVE"
      isCaseStudy?: true
    } = {
      projectId,
    }

    if (isPublic) {
      whereClause.state = "ACTIVE"
      if (caseStudyOnly) {
        whereClause.isCaseStudy = true
      }
    }

    const blog = await prisma.blog.findFirst({
      where: whereClause,
    })

    if (isPublic && !blog) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Blog not found",
      })
      return NextResponse.json(response, { status: 404 })
    }

    const response = successResponseSchema.parse({
      success: true,
      message: blog ? "Blog fetched successfully" : "No blog found for this project",
      data: blog
        ? {
            ...blog,
            project,
          }
        : null,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching blog by project ID:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to fetch blog",
    })
    return NextResponse.json(response, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Unauthorized",
      })
      return NextResponse.json(response, { status: 401 })
    }

    const { projectId } = await params
    const body = await request.json()

    const validationResult = blogSchema.safeParse({
      ...body,
      projectId,
      isCaseStudy: true,
    })

    if (!validationResult.success) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Validation error",
        details: validationResult.error.issues,
      })
      return NextResponse.json(response, { status: 400 })
    }

    const validatedData = validationResult.data
    const removedImagePublicIds: string[] = Array.isArray(body.removedImagePublicIds)
      ? (body.removedImagePublicIds as unknown[]).filter(
          (id): id is string =>
            typeof id === "string" && id.trim().length > 0
        )
      : []

    const nextImagePublicIdSet = new Set(
      (validatedData.imagePublicIds || []).filter(Boolean)
    )

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        slug: true,
        title: true,
        hasCaseStudy: true,
      },
    })

    if (!project) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Project not found",
      })
      return NextResponse.json(response, { status: 404 })
    }

    if (validatedData.isCaseStudy && !project.hasCaseStudy) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Case study disabled for project",
        details: "Enable 'Has Case Study' on this project before saving a case study.",
      })
      return NextResponse.json(response, { status: 400 })
    }

    const existingBlog = await prisma.blog.findUnique({
      where: { projectId },
      select: {
        id: true,
        thumbnail: true,
        thumbnailPublicId: true,
        images: true,
        imagePublicIds: true,
      },
    })

    const nextThumbnail = validatedData.thumbnail || null
    const nextThumbnailPublicId = validatedData.thumbnailPublicId || null

    if (existingBlog) {
      if (existingBlog.thumbnailPublicId) {
        if (existingBlog.thumbnailPublicId !== nextThumbnailPublicId) {
          await deleteFileFromCloudinary(existingBlog.thumbnailPublicId)
        }
      } else if (existingBlog.thumbnail && existingBlog.thumbnail !== nextThumbnail) {
        await deleteFileFromCloudinary(existingBlog.thumbnail)
      }

      const nextImageUrlSet = new Set((validatedData.images || []).filter(Boolean))

      const removedFromExisting = (existingBlog.images || []).flatMap((url, index) => {
        const previousPublicId = existingBlog.imagePublicIds?.[index]

        if (previousPublicId) {
          return nextImagePublicIdSet.has(previousPublicId) ? [] : [previousPublicId]
        }

        return nextImageUrlSet.has(url) ? [] : [url]
      })

      const removedFromPayload = [...new Set(removedImagePublicIds)].filter(
        (publicId) => !nextImagePublicIdSet.has(publicId)
      )

      const imageIdentifiersToDelete = [
        ...new Set([...removedFromExisting, ...removedFromPayload]),
      ]

      if (imageIdentifiersToDelete.length > 0) {
        await Promise.all(
          imageIdentifiersToDelete.map((identifier) =>
            deleteFileFromCloudinary(identifier)
          )
        )
      }
    } else {
      const removedFromPayload = [...new Set(removedImagePublicIds)].filter(
        (publicId) => !nextImagePublicIdSet.has(publicId)
      )

      if (removedFromPayload.length > 0) {
        await Promise.all(
          removedFromPayload.map((identifier) =>
            deleteFileFromCloudinary(identifier)
          )
        )
      }
    }

    const blog = await prisma.blog.upsert({
      where: { projectId },
      create: {
        title: validatedData.title,
        brief: validatedData.brief || null,
        content: validatedData.content,
        thumbnail: validatedData.thumbnail || null,
        thumbnailPublicId: validatedData.thumbnailPublicId || null,
        images: validatedData.images,
        imagePublicIds: validatedData.imagePublicIds,
        isBlog: validatedData.isBlog,
        isCaseStudy: true,
        state: validatedData.state,
        projectId,
        isEnabled: true,
        featured: validatedData.featured,
      },
      update: {
        title: validatedData.title,
        brief: validatedData.brief || null,
        content: validatedData.content,
        thumbnail: validatedData.thumbnail || null,
        thumbnailPublicId: validatedData.thumbnailPublicId || null,
        images: validatedData.images,
        imagePublicIds: validatedData.imagePublicIds,
        isBlog: validatedData.isBlog,
        isCaseStudy: true,
        state: validatedData.state,
        isEnabled: true,
        featured: validatedData.featured,
      },
      include: {
        project: {
          select: {
            id: true,
            slug: true,
            title: true,
            hasCaseStudy: true,
          },
        },
      },
    })

    const response = successResponseSchema.parse({
      success: true,
      message: existingBlog ? "Blog updated successfully" : "Blog created successfully",
      data: blog,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error creating/updating blog:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to save blog",
    })
    return NextResponse.json(response, { status: 500 })
  }
}
