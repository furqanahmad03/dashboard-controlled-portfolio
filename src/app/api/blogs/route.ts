import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { deleteFileFromCloudinary } from "@/lib/cloudinary"
import { errorResponseSchema, rawBlogSchema, successResponseSchema } from "@/lib/validations"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Unauthorized",
      })
      return NextResponse.json(response, { status: 401 })
    }

    const blogs = await prisma.blog.findMany({
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
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    })

    const response = successResponseSchema.parse({
      success: true,
      message: "Blogs fetched successfully",
      data: blogs,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching dashboard blogs:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to fetch blogs",
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
        error: "Unauthorized",
      })
      return NextResponse.json(response, { status: 401 })
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

    const blog = await prisma.blog.create({
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

    const keptImagePublicIdSet = new Set(validatedData.imagePublicIds)
    const imagePublicIdsToDelete = [...new Set(removedImagePublicIds)].filter(
      (publicId) => !keptImagePublicIdSet.has(publicId)
    )

    if (imagePublicIdsToDelete.length > 0) {
      await Promise.all(
        imagePublicIdsToDelete.map((publicId) =>
          deleteFileFromCloudinary(publicId)
        )
      )
    }

    const response = successResponseSchema.parse({
      success: true,
      message: "Raw blog created successfully",
      data: blog,
    })

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating raw blog:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to create blog",
    })
    return NextResponse.json(response, { status: 500 })
  }
}
