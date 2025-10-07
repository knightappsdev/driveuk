import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users, students, instructors, courses, bookings } from '@/lib/db/schema';
import { sql, count } from 'drizzle-orm';
import { validateApiAccess } from '@/lib/auth/auth-helpers';

export async function GET() {
  try {
    // Validate API access
    const accessResult = await validateApiAccess();

    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    // Get total counts
    const [totalUsers] = await db.select({ count: count() }).from(users);
    const [totalStudents] = await db.select({ count: count() }).from(students);
    const [totalInstructors] = await db.select({ count: count() }).from(instructors);
    const [totalCourses] = await db.select({ count: count() }).from(courses);
    const [totalBookings] = await db.select({ count: count() }).from(bookings);

    // Get role distribution
    const roleDistribution = await db
      .select({
        role: users.role,
        count: count()
      })
      .from(users)
      .groupBy(users.role);

    // Get monthly user registrations (last 6 months)
    const monthlyRegistrations = await db
      .select({
        month: sql`TO_CHAR(${users.createdAt}, 'YYYY-MM')`,
        count: count()
      })
      .from(users)
      .where(sql`${users.createdAt} >= NOW() - INTERVAL '6 months'`)
      .groupBy(sql`TO_CHAR(${users.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${users.createdAt}, 'YYYY-MM')`);

    // Get booking statistics
    const bookingStats = await db
      .select({
        status: bookings.status,
        count: count()
      })
      .from(bookings)
      .groupBy(bookings.status);

    // Calculate additional stats
    const completedBookings = bookingStats.find(stat => stat.status === 'completed')?.count || 0;
    const pendingBookings = bookingStats.find(stat => stat.status === 'pending')?.count || 0;

    // Format response to match AdminStats interface
    const adminStats = {
      totalUsers: totalUsers.count,
      totalInstructors: totalInstructors.count,
      totalStudents: totalStudents.count,
      totalCourses: totalCourses.count,
      totalBookings: totalBookings.count,
      pendingBookings: pendingBookings,
      completedLessons: completedBookings,
      totalRevenue: 0, // TODO: Calculate from bookings
      avgRating: 4.8, // TODO: Calculate from actual ratings
    };

    return NextResponse.json(adminStats);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
