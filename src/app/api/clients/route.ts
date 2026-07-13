import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { successResponseSchema, errorResponseSchema } from "@/lib/validations"
import { z } from "zod"

// GET all clients
export async function GET() {
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

    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" }
    })
    
    const response = successResponseSchema.parse({
      success: true,
      message: "Clients fetched successfully",
      data: clients
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching clients:", error)
    
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
      error: "Failed to fetch clients"
    })
    return NextResponse.json(response, { status: 500 })
  }
}

// POST - Create a new client
export async function POST(request: Request) {
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

    const body = await request.json()

    // Validate required fields
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        { 
          success: false,
          error: "Validation Error",
          message: "Client name is required"
        },
        { status: 400 }
      )
    }

    // Create the client
    const newClient = await prisma.client.create({
      data: {
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
    })
    
    const response = successResponseSchema.parse({
      success: true,
      message: "Client created successfully",
      data: newClient
    })
    
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating client:", error)
    
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
      error: "Failed to create client"
    })
    return NextResponse.json(response, { status: 500 })
  }
}
