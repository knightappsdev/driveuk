import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { instructors, students, users, bookings } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { validateApiAccess } from '@/lib/auth/auth-helpers';

// Get instructor's bookings
export async function GET(request: NextRequest) {
  try {
    await validateApiAccess();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending, confirmed, completed, cancelled
    const date = searchParams.get('date'); // specific date filter

    // For now, we'll get the first instructor as a demo
    // In production, this would be based on the authenticated user
    const [instructor] = await db
      .select({ id: instructors.id })
      .from(instructors)
      .limit(1);

    if (!instructor) {
      return NextResponse.json(
        { success: false, error: 'Instructor profile not found' },
        { status: 404 }
      );
    }

    // Build query conditions
    const conditions = [eq(bookings.instructorId, instructor.id)];
    
    if (status) {
      conditions.push(eq(bookings.status, status as any));
    }
    
    if (date) {
      conditions.push(eq(bookings.scheduledDate, date));
    }

    const whereConditions = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Get bookings with student details
    const bookingsData = await db
      .select({
        id: bookings.id,
        studentId: bookings.studentId,
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
        // Student details
        studentFirstName: users.firstName,
        studentLastName: users.lastName,
        studentEmail: users.email,
        studentPhone: users.phone,
        studentLicenseType: students.licenseType,
      })
      .from(bookings)
      .innerJoin(students, eq(bookings.studentId, students.id))
      .innerJoin(users, eq(students.userId, users.id))
      .where(whereConditions)
      .orderBy(desc(bookings.scheduledDate), desc(bookings.scheduledTime));

    return NextResponse.json({
      success: true,
      data: bookingsData
    });

  } catch (error) {
    console.error('Error fetching instructor bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// Update booking status
export async function PUT(request: NextRequest) {
  try {
    await validateApiAccess();

    const body = await request.json();
    const { bookingId, status, notes } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { success: false, error: 'Booking ID and status are required' },
        { status: 400 }
      );
    }

    // For now, we'll get the first instructor as a demo
    const [instructor] = await db
      .select({ id: instructors.id })
      .from(instructors)
      .limit(1);

    if (!instructor) {
      return NextResponse.json(
        { success: false, error: 'Instructor profile not found' },
        { status: 404 }
      );
    }

    // Update the booking
    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status: status,
        bookingNotes: notes,
        updatedAt: new Date()
      })
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.instructorId, instructor.id)
      ))
      .returning();

    if (!updatedBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBooking
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}