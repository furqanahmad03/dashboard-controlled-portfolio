import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormEmail, sendAutoReply } from '@/lib/nodemailer';
import { createContactQuery } from '@/lib/contact-query';
import { contactQuerySchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validationResult = contactQuerySchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.issues[0]?.message || 'Validation error',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const body = validationResult.data;

    // Persist query before sending any email
    const savedQuery = await createContactQuery(body);

    // Check if email configuration is available
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_USER_PASS || !process.env.EMAIL_RECEIVER || !process.env.EMAIL_RECEIVER_PASS) {
      console.error('Email configuration missing');
      return NextResponse.json(
        { success: false, error: 'Email service not configured. Please try again later.' },
        { status: 500 }
      );
    }

    // Send email to the specified receiver
    const adminEmailResult = await sendContactFormEmail({
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
    });

    if (!adminEmailResult.success) {
      console.error('Failed to send admin email:', adminEmailResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    // Send auto-reply to the sender
    const autoReplyResult = await sendAutoReply(body.email, body.name);
    
    if (!autoReplyResult.success) {
      console.warn('Failed to send auto-reply:', autoReplyResult.error);
      // Don't fail the entire request if auto-reply fails
    }

    // Log successful submission
    console.log('Contact form submission successful:', {
      queryId: savedQuery.id,
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      timestamp: new Date().toISOString(),
      adminEmailId: adminEmailResult.messageId,
      autoReplySent: autoReplyResult.success
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully! You should receive a confirmation email shortly.',
        data: {
          id: savedQuery.id,
          timestamp: new Date().toISOString(),
          adminEmailId: adminEmailResult.messageId,
          autoReplySent: autoReplyResult.success
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
