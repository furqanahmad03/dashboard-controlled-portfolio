import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { successResponseSchema, errorResponseSchema } from "@/lib/validations"
import { z } from "zod"

// Validation schema for the request body
const toggleProjectStatusSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  isEnabled: z.boolean()
})

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
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null
      }
    })
  } catch (error) {
    console.error("Error creating activity:", error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Unauthorized"
      })
      return NextResponse.json(response, { status: 401 })
    }

    // Get user from database
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

    // Parse and validate request body
    const body = await request.json()
    const validationResult = toggleProjectStatusSchema.safeParse(body)
    
    if (!validationResult.success) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Validation error",
        details: validationResult.error.issues
      })
      return NextResponse.json(response, { status: 400 })
    }

    const { projectId, isEnabled } = validationResult.data

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!existingProject) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Project not found"
      })
      return NextResponse.json(response, { status: 404 })
    }

    // Update project status
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { isEnabled }
    })

    // Create activity log
    await createActivity(
      user.id,
      "Updated",
      "Project",
      updatedProject.id,
      updatedProject.title,
      `Project ${isEnabled ? 'enabled' : 'disabled'}: ${updatedProject.title}`,
      {
        projectId: updatedProject.id,
        projectTitle: updatedProject.title,
        previousStatus: existingProject.isEnabled,
        newStatus: isEnabled,
        action: isEnabled ? 'enabled' : 'disabled'
      }
    )

    const response = successResponseSchema.parse({
      success: true,
      message: `Project ${isEnabled ? 'enabled' : 'disabled'} successfully`,
      data: {
        id: updatedProject.id,
        title: updatedProject.title,
        isEnabled: updatedProject.isEnabled
      }
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error toggling project status:", error)
    
    if (error instanceof z.ZodError) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Validation error",
        details: error.issues
      })
      return NextResponse.json(response, { status: 400 })
    }
    
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to toggle project status"
    })
    return NextResponse.json(response, { status: 500 })
  }
}
