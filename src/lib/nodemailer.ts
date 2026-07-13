import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport for sending emails
const createTransporter = (useReceiver = false) => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: useReceiver ? process.env.EMAIL_RECEIVER : process.env.EMAIL_USER,
      pass: useReceiver ? process.env.EMAIL_RECEIVER_PASS : process.env.EMAIL_USER_PASS,
    },
  });
};

// Email template for contact form submissions
export const createContactEmailTemplate = (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp?: string;
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8fafc;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2rem;
                text-align: center;
            }
            
            .header h1 {
                font-size: 1.875rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
            }
            
            .header p {
                font-size: 1rem;
                opacity: 0.9;
            }
            
            .content {
                padding: 2rem;
            }
            
            .form-details {
                background-color: #f8fafc;
                border-radius: 8px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .field {
                margin-bottom: 1rem;
            }
            
            .field:last-child {
                margin-bottom: 0;
            }
            
            .field-label {
                font-weight: 600;
                color: #374151;
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 0.25rem;
                display: block;
            }
            
            .field-value {
                color: #1f2937;
                font-size: 1rem;
                word-wrap: break-word;
            }
            
            .message-content {
                background-color: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 1.5rem;
                margin-top: 0.5rem;
                white-space: pre-wrap;
                font-family: inherit;
            }
            
            .footer {
                background-color: #f9fafb;
                padding: 1.5rem 2rem;
                text-align: center;
                border-top: 1px solid #e5e7eb;
            }
            
            .footer p {
                color: #6b7280;
                font-size: 0.875rem;
            }
            
            .timestamp {
                color: #9ca3af;
                font-size: 0.75rem;
                margin-top: 0.5rem;
            }
            
            .badge {
                display: inline-block;
                background-color: #10b981;
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 New Contact Form Submission</h1>
                <p>Someone has reached out through your portfolio website</p>
            </div>
            
            <div class="content">
                <div class="form-details">
                    <div class="field">
                        <span class="field-label">Name</span>
                        <div class="field-value">${data.name}</div>
                    </div>
                    
                    <div class="field">
                        <span class="field-label">Email Address</span>
                        <div class="field-value">
                            <a href="mailto:${data.email}" style="color: #3b82f6; text-decoration: none;">
                                ${data.email}
                            </a>
                        </div>
                    </div>
                    
                    <div class="field">
                        <span class="field-label">Subject</span>
                        <div class="field-value">${data.subject}</div>
                    </div>
                    
                    <div class="field">
                        <span class="field-label">Message</span>
                        <div class="message-content">${data.message}</div>
                    </div>
                    
                    <div class="field">
                        <span class="field-label">Sent At</span>
                        <div class="field-value">${data.timestamp || new Date().toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZoneName: 'short'
                        })}</div>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 1.5rem 0;">
                    <span class="badge">New Message</span>
                </div>
            </div>
            
            <div class="footer">
                <p>This message was sent from your portfolio contact form</p>
                <div class="timestamp">
                    Received on ${new Date().toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZoneName: 'short'
                    })}
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};


export const createAutoReplyTemplate = (name: string, timestamp?: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Your Message</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8fafc;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 2rem;
                text-align: center;
            }
            
            .header h1 {
                font-size: 1.875rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
            }
            
            .header p {
                font-size: 1rem;
                opacity: 0.9;
            }
            
            .content {
                padding: 2rem;
            }
            
            .message {
                font-size: 1.125rem;
                line-height: 1.7;
                color: #374151;
                margin-bottom: 1.5rem;
            }
            
            .highlight {
                background-color: #f0f9ff;
                border-left: 4px solid #3b82f6;
                padding: 1rem;
                margin: 1.5rem 0;
                border-radius: 0 8px 8px 0;
            }
            
            .footer {
                background-color: #f9fafb;
                padding: 1.5rem 2rem;
                border-top: 1px solid #e5e7eb;
            }
            
            .footer p {
                color: #6b7280;
                font-size: 0.875rem;
            }
            
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                padding: 0.75rem 1.5rem;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 1rem 0;
                transition: transform 0.2s;
            }
            
            .cta-button:hover {
                transform: translateY(-1px);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Message Received!</h1>
                <p>Thank you for reaching out</p>
            </div>
            
            <div class="content">
                <div class="message">
                    <p>Hi <strong>${name}</strong>,</p>
                    
                    <p>Thank you for contacting me through my portfolio website. I've received your message and truly appreciate you taking the time to get in touch.</p>
                    
                    <div class="highlight">
                        <p>I'll review your message and get back to you as soon as possible. In the meantime, feel free to explore more of my work on my website or connect with me on social media.</p>
                    </div>
                    
                    <div style="text-align: center; margin: 2rem 0;">
                        <a href="https://www.furqanahmad.me/" class="cta-button">View My Portfolio</a>
                    </div>
                    
                    <p>Looking forward to speaking with you soon!</p>
                    
                    <div style="background-color: #f8fafc; border-radius: 8px; padding: 1rem; margin: 1.5rem 0; text-align: center; border-left: 4px solid #10b981;">
                        <p style="margin: 0; color: #6b7280; font-size: 0.875rem;">
                            <strong>Message sent on:</strong><br>
                            ${timestamp || new Date().toLocaleString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZoneName: 'short'
                            })}
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>Best regards,</p>
                <p><strong>Furqan Ahmad</strong><br>
                Software Engineer<br>
                <a href="mailto:hfurqan.se@gmail.com" style="color: #3b82f6; text-decoration: none;">hfurqan.se@gmail.com</a><br>
                <a href="https://www.furqanahmad.me/" style="color: #3b82f6; text-decoration: none;">https://www.furqanahmad.me/</a></p>
            </div>

            <div style="text-align: center; margin: 2rem 0;">
                <a href="https://www.furqanahmad.me/" target="_blank" rel="noopener noreferrer" class="cta-button">View My Portfolio</a>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Function to send email
export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  useReceiverAccount?: boolean;
}) => {
  try {
    const transporter = createTransporter(options.useReceiverAccount);
    
    const mailOptions = {
      from: options.from || (options.useReceiverAccount ? process.env.EMAIL_RECEIVER : process.env.EMAIL_USER),
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Function to send contact form email to receiver
export const sendContactFormEmail = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const receiverEmail = process.env.EMAIL_RECEIVER; // Send to specified receiver
  
  if (!receiverEmail) {
    throw new Error('Receiver email not configured');
  }

  const timestamp = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const html = createContactEmailTemplate({ ...data, timestamp });
  
  return await sendEmail({
    to: receiverEmail,
    subject: `New Contact Form: ${data.subject}`,
    html,
    useReceiverAccount: false, // Use EMAIL_USER account to send to EMAIL_RECEIVER
  });
};

// Function to send auto-reply to the sender
export const sendAutoReply = async (senderEmail: string, senderName: string) => {
  const timestamp = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const html = createAutoReplyTemplate(senderName, timestamp);
  
  return await sendEmail({
    to: senderEmail,
    subject: 'Thank you for your message - I\'ll get back to you soon!',
    html,
    useReceiverAccount: true, // Use EMAIL_RECEIVER account to send auto-reply
  });
};

export const createQueryReplyTemplate = (data: {
    name: string;
    subject: string;
    message: string;
    timestamp?: string;
}) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${data.subject}</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                    background: #f8fafc;
                    color: #1f2937;
                }
                .container {
                    max-width: 640px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
                }
                .header {
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    color: #ffffff;
                    padding: 24px;
                }
                .content {
                    padding: 24px;
                    line-height: 1.7;
                }
                .message-box {
                    margin-top: 12px;
                    padding: 16px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                    background: #f9fafb;
                    white-space: pre-wrap;
                }
                .footer {
                    background-color: #f9fafb;
                    padding: 1.5rem 2rem;
                    border-top: 1px solid #e5e7eb;
                }
            
                .footer p {
                    color: #6b7280;
                    font-size: 0.875rem;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2 style="margin: 0;">Reply to Your Query</h2>
                    <p style="margin: 8px 0 0 0; opacity: 0.9;">${data.subject}</p>
                </div>
                <div class="content">
                    <p>Hi ${data.name},</p>
                    <div class="message-box">${data.message}</div>
                </div>
                <div class="footer">
                    <p>Best regards,</p>
                    <p><strong>Furqan Ahmad</strong><br>
                    Software Engineer<br>
                    <a href="mailto:hfurqan.se@gmail.com" style="color: #3b82f6; text-decoration: none;">hfurqan.se@gmail.com</a><br>
                    <a href="https://www.furqanahmad.me/" style="color: #3b82f6; text-decoration: none;">https://www.furqanahmad.me/</a></p>
                </div>
            </div>
        </body>
        </html>
    `;
};

export const sendQueryReplyEmail = async (data: {
    to: string;
    name: string;
    subject: string;
    message: string;
}) => {
    const timestamp = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });

    const html = createQueryReplyTemplate({
        name: data.name,
        subject: data.subject,
        message: data.message,
        timestamp,
    });

    return await sendEmail({
        to: data.to,
        subject: data.subject,
        html,
        useReceiverAccount: true,
    });
};
