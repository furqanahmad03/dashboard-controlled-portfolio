import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { successResponseSchema, errorResponseSchema } from "@/lib/validations"
import { z } from "zod"

// PUT - Update a client
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized",
          message: "You must be logged in to access this resource"
        },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Validate the client data
    const clientData = {
      name: body.name || null,
      email: body.email || null,
      phone: body.phone || null,
      city: body.city || null,
      state: body.state || null,
      country: body.country || null,
      sourceName: body.sourceName || null,
      sourceWebsite: body.sourceWebsite || null,
      company: body.company || null,
      industry: body.industry || null,
      budget: body.budget || null,
      notes: body.notes || null,
    }

    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id }
    })

    if (!existingClient) {
      return NextResponse.json(
        { 
          success: false,
          error: "Not Found",
          message: "Client not found"
        },
        { status: 404 }
      )
    }

    // Update the client
    const updatedClient = await prisma.client.update({
      where: { id },
      data: clientData
    })
    
    const response = successResponseSchema.parse({
      success: true,
      message: "Client updated successfully",
      data: updatedClient
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error updating client:", error)
    
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
      error: "Failed to update client"
    })
    return NextResponse.json(response, { status: 500 })
  }
}

// DELETE - Delete a client (only if no projects are associated)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized",
          message: "You must be logged in to access this resource"
        },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id },
      include: {
        projects: true
      }
    })

    if (!existingClient) {
      return NextResponse.json(
        { 
          success: false,
          error: "Not Found",
          message: "Client not found"
        },
        { status: 404 }
      )
    }

    // Check if client has associated projects
    if (existingClient.projects && existingClient.projects.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "Cannot Delete",
          message: "Cannot delete client with associated projects. Please delete the projects first."
        },
        { status: 400 }
      )
    }

    // Delete the client
    await prisma.client.delete({
      where: { id }
    })
    
    const response = successResponseSchema.parse({
      success: true,
      message: "Client deleted successfully"
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error deleting client:", error)
    
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
      error: "Failed to delete client"
    })
    return NextResponse.json(response, { status: 500 })
  }
}
