import { NextResponse } from 'next/server';
import { resend, EMAIL_CONFIG, FormSubmissionData } from '@/lib/email/config';
import { createFormSubmissionTemplate, createAutoResponseTemplate } from '@/lib/email/templates';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { type, data, customerEmail } = body;

    // Validate required fields
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type and data' },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get request metadata
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || undefined;
    const forwarded = headersList.get('x-forwarded-for');
    const ipAddress = forwarded?.split(',')[0]?.trim() || 
                     headersList.get('x-real-ip') || 
                     undefined;

    // Create submission object
    const submission: FormSubmissionData = {
      type,
      data,
      timestamp: new Date(),
      userAgent,
      ipAddress,
    };

    // Generate email templates
    const formSubmissionTemplate = createFormSubmissionTemplate(submission);
    const autoResponseTemplate = createAutoResponseTemplate(submission);

    // Prepare email sending promises
    const emailPromises: Promise<any>[] = [];

    // 1. Send form submission to dsforms@ofemo.uk
    emailPromises.push(
      resend.emails.send({
        from: EMAIL_CONFIG.SUPPORT_SENDER,
        to: EMAIL_CONFIG.FORM_RECIPIENT,
        subject: formSubmissionTemplate.subject,
        html: formSubmissionTemplate.html,
        text: formSubmissionTemplate.text,
        replyTo: customerEmail || undefined,
      })
    );

    // 2. Send automated response to customer (if email provided)
    if (customerEmail) {
      emailPromises.push(
        resend.emails.send({
          from: EMAIL_CONFIG.SUPPORT_SENDER,
          to: customerEmail,
          subject: autoResponseTemplate.subject,
          html: autoResponseTemplate.html,
          text: autoResponseTemplate.text,
          replyTo: EMAIL_CONFIG.SUPPORT_SENDER,
        })
      );
    }

    // Send all emails
    const results = await Promise.allSettled(emailPromises);

    // Check results
    const formSubmissionResult = results[0];
    const autoResponseResult = results.length > 1 ? results[1] : null;

    // Prepare response
    const response: any = {
      success: true,
      message: 'Form submission processed successfully',
      formSubmissionSent: formSubmissionResult.status === 'fulfilled',
      autoResponseSent: autoResponseResult ? autoResponseResult.status === 'fulfilled' : false,
    };

    // Add error details if any failures
    if (formSubmissionResult.status === 'rejected') {
      response.formSubmissionError = formSubmissionResult.reason?.message || 'Unknown error';
      console.error('Form submission email failed:', formSubmissionResult.reason);
    }

    if (autoResponseResult && autoResponseResult.status === 'rejected') {
      response.autoResponseError = autoResponseResult.reason?.message || 'Unknown error';
      console.error('Auto response email failed:', autoResponseResult.reason);
    }

    // If form submission failed, return error (this is critical)
    if (formSubmissionResult.status === 'rejected') {
      return NextResponse.json(
        { 
          error: 'Failed to send form submission', 
          details: response.formSubmissionError 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}