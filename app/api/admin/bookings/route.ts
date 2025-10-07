import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { bookings, users as usersTable, instructors, students } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { validateApiAccess } from '@/lib/auth/auth-helpers';

export async function GET() {
  try {
    const accessResult = await validateApiAccess();

    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    const bookingsData = await db
      .select({
        id: bookings.id,
        studentId: bookings.studentId,
        instructorId: bookings.instructorId,
        lessonType: bookings.lessonType,
        scheduledDate: bookings.scheduledDate,
        duration: bookings.duration,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus,
        totalAmount: bookings.totalAmount,
        bookingNotes: bookings.bookingNotes,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        // Student info
        studentFirstName: usersTable.firstName,
        studentLastName: usersTable.lastName,
        studentEmail: usersTable.email,
        // Instructor info
        instructorUserId: instructors.userId,
      })
      .from(bookings)
      .leftJoin(students, eq(bookings.studentId, students.id))
      .leftJoin(usersTable, eq(students.userId, usersTable.id))
      .leftJoin(instructors, eq(bookings.instructorId, instructors.id))
      .orderBy(desc(bookings.createdAt))
      .limit(100);

    return NextResponse.json({
      success: true,
      data: bookingsData,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
