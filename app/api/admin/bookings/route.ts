import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { 
  bookings, 
  students, 
  instructors, 
  courses, 
  users as studentUsers,
  users as instructorUsers,
  BookingStatus,
  type NewBooking 
} from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { desc, eq, and, isNull } from 'drizzle-orm';
import { z } from 'zod';

// Validation schemas
const createBookingSchema = z.object({
  studentId: z.number().min(1, 'Student ID is required'),
  instructorId: z.number().min(1, 'Instructor ID is required'),
  courseId: z.number().min(1, 'Course ID is required'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  duration: z.number().min(30, 'Duration must be at least 30 minutes').max(480), // Max 8 hours
  totalCost: z.number().min(1, 'Total cost must be positive'),
  notes: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).default('pending'),
});

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

// GET: Fetch all bookings
export async function GET() {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all bookings with related data
    const allBookings = await db
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
        studentName: studentUsers.name,
        studentEmail: studentUsers.email,
        studentPhone: studentUsers.phone,
        // Instructor info  
        instructorName: instructorUsers.name,
        instructorEmail: instructorUsers.email,
        instructorPhone: instructorUsers.phone,
        // Course info
        courseTitle: courses.title,
        courseLevel: courses.level,
      })
      .from(bookings)
      .innerJoin(students, eq(bookings.studentId, students.id))
      .innerJoin(studentUsers, eq(students.userId, studentUsers.id))
      .innerJoin(instructors, eq(bookings.instructorId, instructors.id))
      .innerJoin(instructorUsers, eq(instructors.userId, instructorUsers.id))
      .innerJoin(courses, eq(bookings.courseId, courses.id))
      .where(and(
        isNull(studentUsers.deletedAt),
        isNull(instructorUsers.deletedAt)
      ))
      .orderBy(desc(bookings.createdAt));

    return NextResponse.json(allBookings);

  } catch (error) {
    console.error('Admin bookings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST: Create new booking
export async function POST(request: NextRequest) {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createBookingSchema.parse(body);

    // Verify student exists
    const [studentExists] = await db
      .select({ id: students.id })
      .from(students)
      .innerJoin(studentUsers, eq(students.userId, studentUsers.id))
      .where(and(
        eq(students.id, validatedData.studentId),
        isNull(studentUsers.deletedAt)
      ))
      .limit(1);

    if (!studentExists) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 400 }
      );
    }

    // Verify instructor exists
    const [instructorExists] = await db
      .select({ id: instructors.id })
      .from(instructors)
      .innerJoin(instructorUsers, eq(instructors.userId, instructorUsers.id))
      .where(and(
        eq(instructors.id, validatedData.instructorId),
        isNull(instructorUsers.deletedAt),
        eq(instructors.isApproved, true)
      ))
      .limit(1);

    if (!instructorExists) {
      return NextResponse.json(
        { error: 'Instructor not found or not approved' },
        { status: 400 }
      );
    }

    // Verify course exists
    const [courseExists] = await db
      .select({ id: courses.id })
      .from(courses)
      .where(and(
        eq(courses.id, validatedData.courseId),
        eq(courses.isActive, true)
      ))
      .limit(1);

    if (!courseExists) {
      return NextResponse.json(
        { error: 'Course not found or inactive' },
        { status: 400 }
      );
    }

    // Create new booking
    const newBooking: NewBooking = {
      studentId: validatedData.studentId,
      instructorId: validatedData.instructorId,
      courseId: validatedData.courseId,
      status: validatedData.status,
      scheduledDate: new Date(validatedData.scheduledDate),
      duration: validatedData.duration,
      totalCost: validatedData.totalCost.toString(),
      notes: validatedData.notes || null,
    };

    const [createdBooking] = await db
      .insert(bookings)
      .values(newBooking)
      .returning();

    return NextResponse.json(
      { 
        message: 'Booking created successfully',
        booking: createdBooking 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Booking creation error:', error);
    
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
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}