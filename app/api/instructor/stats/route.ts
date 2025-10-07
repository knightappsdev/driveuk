import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { instructors, students, users, bookings } from '@/lib/db/schema';
import { eq, count, and, gte, countDistinct } from 'drizzle-orm';
import { validateApiAccess } from '@/lib/auth/auth-helpers';

// Get instructor dashboard stats
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

    // Get stats in parallel
    const [
      activeStudentsResult,
      totalBookingsResult,
      todaysBookingsResult,
      weeklyBookingsResult,
    ] = await Promise.all([
      // Active students with bookings with this instructor
      db.select({ count: countDistinct(bookings.studentId) })
        .from(bookings)
        .innerJoin(students, eq(bookings.studentId, students.id))
        .innerJoin(users, eq(students.userId, users.id))
        .where(and(
          eq(bookings.instructorId, instructor.id),
          eq(users.isActive, true)
        )),

      // Total bookings for this instructor
      db.select({ count: count() })
        .from(bookings)
        .where(eq(bookings.instructorId, instructor.id)),

      // Today's bookings
      db.select({ count: count() })
        .from(bookings)
        .where(and(
          eq(bookings.instructorId, instructor.id),
          eq(bookings.scheduledDate, new Date().toISOString().split('T')[0])
        )),

      // This week's bookings (approximate)
      db.select({ count: count() })
        .from(bookings)
        .where(and(
          eq(bookings.instructorId, instructor.id),
          gte(bookings.scheduledDate, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        )),
    ]);

    const stats = {
      activeStudents: activeStudentsResult[0]?.count || 0,
      totalBookings: totalBookingsResult[0]?.count || 0,
      todaysLessons: todaysBookingsResult[0]?.count || 0,
      thisWeekLessons: weeklyBookingsResult[0]?.count || 0,
      // Mock data for now - would need additional tables for these
      weeklyEarnings: 1240,
      averageRating: 4.8,
      completedLessons: 156,
      pendingBookings: 3,
      responseRate: 95
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching instructor stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch instructor stats' },
      { status: 500 }
    );
  }
}