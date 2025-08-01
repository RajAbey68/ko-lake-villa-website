import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
  subject?: string;
}

// Email recipients - all messages will be sent to these addresses
const EMAIL_RECIPIENTS = [
  'contact@KolakeHouse.com',
  'RajAbey68@gmail.com',
  'Amir.laurie@gmail.com',
  'RajivAB@Hotmail.com',
  'contact.KoLac@gmail.com'
];

// Create email transporter
const createTransporter = () => {
  // You can configure this with your preferred email service
  // For production, use environment variables for credentials
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'contact@kolakeHouse.com',
      pass: process.env.SMTP_PASSWORD || '' // Use app password for Gmail
    },
  });
};

// Send email to all recipients
const sendContactEmail = async (formData: ContactFormData) => {
  const transporter = createTransporter();
  
  const emailContent = `
    New Contact Form Submission - Ko Lake Ambalama
    
    Name: ${formData.name}
    Email: ${formData.email}
    Phone: ${formData.phone || 'Not provided'}
    Subject: ${formData.subject || 'General Inquiry'}
    
    Message:
    ${formData.message}
    
    Submitted at: ${new Date().toLocaleString()}
    
    ---
    This message was sent from the Ko Lake Ambalama contact form.
  `;

  const mailOptions = {
    from: `"Ko Lake Ambalama Contact Form" <${process.env.SMTP_USER || 'contact@kolakeHouse.com'}>`,
    to: EMAIL_RECIPIENTS.join(', '),
    subject: `Ko Lake Ambalama Contact: ${formData.subject || 'New Message from ' + formData.name}`,
    text: emailContent,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
          <p style="color: #fef3c7; margin: 5px 0 0 0;">Ko Lake Ambalama</p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
          <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <h3 style="color: #374151; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
            <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${formData.subject || 'General Inquiry'}</p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px;">
            <h3 style="color: #374151; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${formData.message}</p>
          </div>
          
          <div style="margin-top: 15px; padding: 10px; background: #fef3c7; border-radius: 6px; font-size: 12px; color: #92400e;">
            <p style="margin: 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin: 5px 0 0 0;">This message was sent from the Ko Lake Ambalama contact form.</p>
          </div>
        </div>
      </div>
    `,
    replyTo: formData.email // Allow direct reply to the customer
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error };
  }
};

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Log the contact attempt
    console.log('Contact form submission:', {
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      message: body.message,
      timestamp: new Date().toISOString()
    });

    // Send email to all recipients
    const emailResult = await sendContactEmail(body);
    
    if (emailResult.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Thank you for your message. We have received your inquiry and will get back to you soon!',
          messageId: emailResult.messageId
        },
        { status: 200 }
      );
    } else {
      // Even if email fails, we still log the submission
      console.error('Email sending failed but form was processed:', emailResult.error);
      return NextResponse.json(
        { 
          success: true,
          message: 'Thank you for your message. We have received your inquiry and will get back to you soon!',
          warning: 'Email notification may have failed, but your message was received.'
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form. Please try again.' },
      { status: 500 }
    );
  }
} 