import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { students, users, bookings, instructors } from '@/lib/db/schema';
import { eq, count, and } from 'drizzle-orm';
import { validateApiAccess } from '@/lib/auth/auth-helpers';

// Get student dashboard data
export async function GET(request: NextRequest) {
  try {
    await validateApiAccess();

    // For now, we'll get the first student as a demo
    // In production, this would be based on the authenticated user
    const [student] = await db
      .select({ 
        id: students.id,
        userId: students.userId,
        licenseType: students.licenseType,
        licenseNumber: students.licenseNumber,
        theoryTestPassed: students.theoryTestPassed,
        practicalTestPassed: students.practicalTestPassed,
        dateOfBirth: students.dateOfBirth,
        address: students.address,
        emergencyContact: students.emergencyContact,
        learningGoals: students.learningGoals,
        createdAt: students.createdAt,
        // User fields
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
      })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .limit(1);

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student profile not found' },
        { status: 404 }
      );
    }

    // Get student stats
    const [
      totalBookingsResult,
      completedBookingsResult,
      upcomingBookingsResult,
    ] = await Promise.all([
      // Total bookings
      db.select({ count: count() })
        .from(bookings)
        .where(eq(bookings.studentId, student.id)),

      // Completed bookings (where status is completed)
      db.select({ count: count() })
        .from(bookings)
        .where(and(
          eq(bookings.studentId, student.id),
          eq(bookings.status, 'completed')
        )),

      // Upcoming bookings (where status is confirmed or pending)
      db.select({ count: count() })
        .from(bookings)
        .where(and(
          eq(bookings.studentId, student.id),
          // Add date filter for future dates
        )),
    ]);

    const stats = {
      totalLessons: totalBookingsResult[0]?.count || 0,
      completedLessons: completedBookingsResult[0]?.count || 0,
      upcomingLessons: upcomingBookingsResult[0]?.count || 0,
      progress: totalBookingsResult[0]?.count > 0 
        ? Math.round((completedBookingsResult[0]?.count || 0) / totalBookingsResult[0].count * 100) 
        : 0,
      theoryTestStatus: student.theoryTestPassed ? 'passed' : 'pending',
      practicalTestStatus: student.practicalTestPassed ? 'passed' : 'pending',
    };

    return NextResponse.json({
      success: true,
      data: {
        profile: student,
        stats
      }
    });

  } catch (error) {
    console.error('Error fetching student dashboard data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch student data' },
      { status: 500 }
    );
  }
}