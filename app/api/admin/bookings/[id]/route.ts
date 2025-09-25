import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { bookings, students, instructors, courses, users } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { eq, and, isNull } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for updates
const updateBookingSchema = z.object({
  studentId: z.number().min(1).optional(),
  instructorId: z.number().min(1).optional(),
  courseId: z.number().min(1).optional(),
  scheduledDate: z.string().optional(),
  duration: z.number().min(30).max(480).optional(),
  totalCost: z.number().min(1).optional(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
});

// GET: Fetch individual booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const bookingId = parseInt(id);
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const [booking] = await db
      .select({
        id: bookings.id,
        studentId: bookings.studentId,
        instructorId: bookings.instructorId,
        courseId: bookings.courseId,
        status: bookings.status,
        scheduledDate: bookings.scheduledDate,
        duration: bookings.duration,
        totalCost: bookings.totalCost,
        notes: bookings.notes,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        // Student info
        studentName: users.name,
        studentEmail: users.email,
        // Course info
        courseTitle: courses.title,
      })
      .from(bookings)
      .innerJoin(students, eq(bookings.studentId, students.id))
      .innerJoin(users, eq(students.userId, users.id))
      .innerJoin(courses, eq(bookings.courseId, courses.id))
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);

  } catch (error) {
    console.error('Booking fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// PUT: Update booking
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const bookingId = parseInt(id);
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateBookingSchema.parse(body);

    // Check if booking exists
    const [existingBooking] = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update booking
    const updateData: any = {
      ...(validatedData.studentId && { studentId: validatedData.studentId }),
      ...(validatedData.instructorId && { instructorId: validatedData.instructorId }),
      ...(validatedData.courseId && { courseId: validatedData.courseId }),
      ...(validatedData.scheduledDate && { scheduledDate: new Date(validatedData.scheduledDate) }),
      ...(validatedData.duration && { duration: validatedData.duration }),
      ...(validatedData.totalCost && { totalCost: validatedData.totalCost.toString() }),
      ...(validatedData.notes !== undefined && { notes: validatedData.notes || null }),
      ...(validatedData.status && { status: validatedData.status }),
      updatedAt: new Date(),
    };

    const [updatedBooking] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, bookingId))
      .returning();

    return NextResponse.json({
      message: 'Booking updated successfully',
      booking: updatedBooking,
    });

  } catch (error) {
    console.error('Booking update error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE: Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const bookingId = parseInt(id);
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    // Check if booking exists
    const [existingBooking] = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Delete booking
    await db
      .delete(bookings)
      .where(eq(bookings.id, bookingId));

    return NextResponse.json({
      message: 'Booking deleted successfully',
    });

  } catch (error) {
    console.error('Booking deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}