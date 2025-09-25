import { NextResponse } from 'next/server';

interface BookingRequest {
  courseId: string;
  instructorId?: string;
  transmissionType: 'manual' | 'automatic';
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredLocation: string;
  preferredTimes: string[];
  message?: string;
}

export async function POST(request: Request) {
  try {
    const bookingData: BookingRequest = await request.json();
    
    // Validate required fields
    const requiredFields: (keyof BookingRequest)[] = ['courseId', 'transmissionType', 'studentName', 'studentEmail', 'studentPhone'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.studentEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Check course and instructor availability
    // 2. Save booking to database
    // 3. Send confirmation emails to student and instructor
    // 4. Create calendar events
    // 5. Send WhatsApp notifications if enabled

    console.log('New booking request:', bookingData);

    // Generate booking reference
    const bookingRef = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Simulate processing
    return NextResponse.json({ 
      success: true,
      message: 'Booking request received successfully! We will contact you within 24 hours to confirm your lessons.',
      bookingReference: bookingRef,
      estimatedResponse: '24 hours'
    });
  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const bookingRef = searchParams.get('ref');

  try {
    // In a real application, you would fetch bookings from database
    // For demo purposes, return mock data
    
    const mockBookings = [
      {
        id: '1',
        bookingReference: 'BK-1234567890-ABC123',
        courseTitle: 'Beginner Course',
        instructorName: 'Sarah Jones',
        transmissionType: 'manual',
        status: 'confirmed',
        nextLesson: '2024-01-15T10:00:00Z',
        totalLessons: 30,
        completedLessons: 5,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];

    if (bookingRef) {
      const booking = mockBookings.find(b => b.bookingReference === bookingRef);
      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ booking });
    }

    return NextResponse.json({ bookings: mockBookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}