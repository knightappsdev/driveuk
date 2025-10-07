import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { students, users, bookings, instructors } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { validateApiAccess } from '@/lib/auth/auth-helpers';

// Get student's bookings
export async function GET(request: NextRequest) {
  try {
    await validateApiAccess();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending, confirmed, completed, cancelled
    const upcoming = searchParams.get('upcoming'); // true/false

    // For now, we'll get the first student as a demo
    // In production, this would be based on the authenticated user
    const [student] = await db
      .select({ id: students.id })
      .from(students)
      .limit(1);

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student profile not found' },
        { status: 404 }
      );
    }

    // Build query conditions
    const conditions = [eq(bookings.studentId, student.id)];
    
    if (status) {
      conditions.push(eq(bookings.status, status as any));
    }
    
    if (upcoming === 'true') {
      // Add filter for future dates
      const today = new Date().toISOString().split('T')[0];
      conditions.push(eq(bookings.scheduledDate, today)); // This would need proper date comparison
    }

    const whereConditions = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Get bookings with instructor details
    const bookingsData = await db
      .select({
        id: bookings.id,
        instructorId: bookings.instructorId,
        lessonType: bookings.lessonType,
        scheduledDate: bookings.scheduledDate,
        scheduledTime: bookings.scheduledTime,
        duration: bookings.duration,
        pickupLocation: bookings.pickupLocation,
        dropoffLocation: bookings.dropoffLocation,
        lessonFocus: bookings.lessonFocus,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus,
        totalAmount: bookings.totalAmount,
        paidAmount: bookings.paidAmount,
        bookingNotes: bookings.bookingNotes,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        // Instructor details
        instructorFirstName: users.firstName,
        instructorLastName: users.lastName,
        instructorPhone: users.phone,
        instructorEmail: users.email,
        adiBadgeNumber: instructors.adiBadgeNumber,
        hourlyRate: instructors.hourlyRate,
      })
      .from(bookings)
      .innerJoin(instructors, eq(bookings.instructorId, instructors.id))
      .innerJoin(users, eq(instructors.userId, users.id))
      .where(whereConditions)
      .orderBy(desc(bookings.scheduledDate), desc(bookings.scheduledTime));

    return NextResponse.json({
      success: true,
      data: bookingsData
    });

  } catch (error) {
    console.error('Error fetching student bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// Create new booking request
export async function POST(request: NextRequest) {
  try {
    await validateApiAccess();

    const body = await request.json();
    const {
      instructorId,
      lessonType,
      scheduledDate,
      scheduledTime,
      duration,
      pickupLocation,
      dropoffLocation,
      lessonFocus,
      totalAmount
    } = body;

    // For now, we'll get the first student as a demo
    const [student] = await db
      .select({ id: students.id })
      .from(students)
      .limit(1);

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student profile not found' },
        { status: 404 }
      );
    }

    // Create new booking
    const [newBooking] = await db
      .insert(bookings)
      .values({
        studentId: student.id,
        instructorId: parseInt(instructorId),
        lessonType: lessonType || 'practical',
        scheduledDate,
        scheduledTime,
        duration: duration || 60,
        pickupLocation,
        dropoffLocation,
        lessonFocus,
        status: 'pending',
        paymentStatus: 'pending',
        totalAmount: totalAmount || '0.00',
        paidAmount: '0.00',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newBooking
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating student booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}