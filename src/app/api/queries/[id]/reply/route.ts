import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  contactQueryReplySchema,
  errorResponseSchema,
  successResponseSchema,
} from "@/lib/validations"
import { sendQueryReplyEmail } from "@/lib/nodemailer"

export async function POST(
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

    const body = await request.json()
    const validationResult = contactQueryReplySchema.safeParse(body)

    if (!validationResult.success) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Validation error",
        details: validationResult.error.issues,
      })
      return NextResponse.json(response, { status: 400 })
    }

    if (!process.env.EMAIL_RECEIVER || !process.env.EMAIL_RECEIVER_PASS) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Reply email is not configured",
      })
      return NextResponse.json(response, { status: 500 })
    }

    const { id } = await params
    const query = await prisma.contactQuery.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    if (!query) {
      const response = errorResponseSchema.parse({
        success: false,
        error: "Query not found",
      })
      return NextResponse.json(response, { status: 404 })
    }

    const validatedData = validationResult.data

    const emailResult = await sendQueryReplyEmail({
      to: query.email,
      name: query.name,
      subject: validatedData.subject,
      message: validatedData.message,
    })

    if (!emailResult.success) {
      const response = errorResponseSchema.parse({
        success: false,
        error: emailResult.error || "Failed to send reply email",
      })
      return NextResponse.json(response, { status: 500 })
    }

    const reply = await prisma.contactQueryReply.create({
      data: {
        queryId: query.id,
        subject: validatedData.subject,
        message: validatedData.message,
        recipientEmail: query.email,
        senderEmail: process.env.EMAIL_RECEIVER,
        emailMessageId: emailResult.messageId || null,
      },
    })

    const response = successResponseSchema.parse({
      success: true,
      message: "Reply sent successfully",
      data: reply,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error replying to query:", error)
    const response = errorResponseSchema.parse({
      success: false,
      error: "Failed to reply to query",
    })
    return NextResponse.json(response, { status: 500 })
  }
}
