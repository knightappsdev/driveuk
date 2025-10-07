import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { instructors, students, users, bookings } from '@/lib/db/schema';
import { eq, countDistinct, count, desc } from 'drizzle-orm';
import { validateApiAccess } from '@/lib/auth/auth-helpers';

// Get instructor's students
export async function GET(request: NextRequest) {
  try {
    await validateApiAccess();

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

    // Get students who have bookings with this instructor
    const studentsData = await db
      .select({
        studentId: students.id,
        userId: students.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
        licenseType: students.licenseType,
        licenseNumber: students.licenseNumber,
        theoryTestPassed: students.theoryTestPassed,
        practicalTestPassed: students.practicalTestPassed,
        dateOfBirth: students.dateOfBirth,
        createdAt: students.createdAt,
      })
      .from(bookings)
      .innerJoin(students, eq(bookings.studentId, students.id))
      .innerJoin(users, eq(students.userId, users.id))
      .where(eq(bookings.instructorId, instructor.id))
      .groupBy(
        students.id,
        students.userId,
        users.firstName,
        users.lastName,
        users.email,
        users.phone,
        students.licenseType,
        students.licenseNumber,
        students.theoryTestPassed,
        students.practicalTestPassed,
        students.dateOfBirth,
        students.createdAt
      )
      .orderBy(desc(students.createdAt));

    // Get booking counts for each student
    const studentsWithStats = await Promise.all(
      studentsData.map(async (student) => {
        const [totalBookings] = await db
          .select({ count: count() })
          .from(bookings)
          .where(eq(bookings.studentId, student.studentId));

        const [completedBookings] = await db
          .select({ count: count() })
          .from(bookings)
          .where(eq(bookings.studentId, student.studentId));
          // Add filter for completed status when available

        return {
          ...student,
          totalLessons: totalBookings.count || 0,
          completedLessons: completedBookings.count || 0,
          progress: totalBookings.count > 0 ? Math.round((completedBookings.count / totalBookings.count) * 100) : 0
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: studentsWithStats
    });

  } catch (error) {
    console.error('Error fetching instructor students:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}