import { NextResponse } from 'next/server';

interface WhatsAppMessage {
  phone: string;
  message: string;
  type: 'general' | 'booking' | 'instructor_inquiry' | 'support';
  metadata?: {
    courseId?: string;
    instructorId?: string;
    studentName?: string;
    preferredLocation?: string;
  };
}

export async function POST(request: Request) {
  try {
    const messageData: WhatsAppMessage = await request.json();
    
    // Validate required fields
    if (!messageData.phone || !messageData.message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(messageData.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Integrate with WhatsApp Business API
    // 2. Queue the message for delivery
    // 3. Log the interaction in CRM
    // 4. Track engagement metrics

    console.log('WhatsApp message request:', messageData);

    // Format the message based on type
    let formattedMessage = messageData.message;
    
    if (messageData.type === 'booking' && messageData.metadata) {
      formattedMessage = `
🚗 New Booking Inquiry

Student: ${messageData.metadata.studentName || 'Not provided'}
Course: ${messageData.metadata.courseId || 'Not specified'}
Location: ${messageData.metadata.preferredLocation || 'Not specified'}
Instructor: ${messageData.metadata.instructorId || 'Any available'}

Message: ${messageData.message}

Please respond within 24 hours.
      `.trim();
    }

    // Generate WhatsApp URL (for demo purposes)
    const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER || '447123456789';
    const encodedMessage = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    return NextResponse.json({ 
      success: true,
      message: 'Message prepared for WhatsApp delivery',
      whatsappUrl: whatsappUrl,
      messageId: `WA-${Date.now()}`
    });
  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
    return NextResponse.json(
      { error: 'Failed to process WhatsApp message' },
      { status: 500 }
    );
  }
}