import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { replaceFileInCloudinary, uploadFileToCloudinary } from "@/lib/cloudinary"
import { errorResponseSchema, successResponseSchema } from "@/lib/validations"

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

    const formData = await request.formData()
    const fileEntry = formData.get("file")
    const oldPublicId = (formData.get("oldPublicId") as string | null) || ""

    if (!(fileEntry instanceof File) || fileEntry.size === 0) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Thumbnail file is required",
      })
      return NextResponse.json(response, { status: 400 })
    }

    if (!fileEntry.type.startsWith("image/")) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Only image uploads are allowed",
      })
      return NextResponse.json(response, { status: 400 })
    }

    if (fileEntry.size > 5 * 1024 * 1024) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Thumbnail must be 5MB or smaller",
      })
      return NextResponse.json(response, { status: 400 })
    }

    const file = fileEntry

    let uploadResult: { url: string; publicId: string }
    if (oldPublicId) {
      uploadResult = await replaceFileInCloudinary(file, oldPublicId, {
        folder: "blog-thumbnails",
      })
    } else {
      uploadResult = await uploadFileToCloudinary(file, {
        folder: "blog-thumbnails",
      })
    }

    const response = successResponseSchema.parse({
      success: true,
      message: "Thumbnail uploaded successfully",
      data: uploadResult,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error uploading blog thumbnail:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to upload thumbnail",
    })
    return NextResponse.json(response, { status: 500 })
  }
}
