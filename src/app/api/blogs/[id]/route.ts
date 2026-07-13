import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { deleteFileFromCloudinary } from "@/lib/cloudinary"
import { errorResponseSchema, rawBlogSchema, successResponseSchema } from "@/lib/validations"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params
    const blog = await prisma.blog.findUnique({
      where: { id },
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

    if (!blog) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Blog not found",
      })
      return NextResponse.json(response, { status: 404 })
    }

    const response = successResponseSchema.parse({
      success: true,
      message: "Blog fetched successfully",
      data: blog,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching blog:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to fetch blog",
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
        error: "Unauthorized",
      })
      return NextResponse.json(response, { status: 401 })
    }

    const { id } = await params

    const existingBlog = await prisma.blog.findUnique({
      where: { id },
      select: {
        id: true,
        thumbnail: true,
        projectId: true,
        thumbnailPublicId: true,
        images: true,
        imagePublicIds: true,
      },
    })

    if (!existingBlog) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Blog not found",
      })
      return NextResponse.json(response, { status: 404 })
    }

    if (existingBlog.projectId) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Project-linked blogs must be edited from the project blog editor",
      })
      return NextResponse.json(response, { status: 400 })
    }

    const body = await request.json()

    const validationResult = rawBlogSchema.safeParse({
      ...body,
      isBlog: true,
      isCaseStudy: false,
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

    const nextThumbnail = validatedData.thumbnail || null
    const nextThumbnailPublicId = validatedData.thumbnailPublicId || null

    if (existingBlog.thumbnailPublicId) {
      if (existingBlog.thumbnailPublicId !== nextThumbnailPublicId) {
        await deleteFileFromCloudinary(existingBlog.thumbnailPublicId)
      }
    } else if (existingBlog.thumbnail && existingBlog.thumbnail !== nextThumbnail) {
      await deleteFileFromCloudinary(existingBlog.thumbnail)
    }

    const nextImagePublicIdSet = new Set(
      (validatedData.imagePublicIds || []).filter(Boolean)
    )
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

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: validatedData.title,
        brief: validatedData.brief || null,
        content: validatedData.content,
        thumbnail: validatedData.thumbnail || null,
        thumbnailPublicId: validatedData.thumbnailPublicId || null,
        images: validatedData.images,
        imagePublicIds: validatedData.imagePublicIds,
        isBlog: true,
        isCaseStudy: false,
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
      message: "Raw blog updated successfully",
      data: blog,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error updating raw blog:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to update blog",
    })
    return NextResponse.json(response, { status: 500 })
  }
}
