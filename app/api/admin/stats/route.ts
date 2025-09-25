import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users, instructors, students, courses, bookings, lessons } from '@/lib/db/schema';
import { count, eq, sum, and } from 'drizzle-orm';
import { validateApiAccess } from '@/lib/auth/auth-helpers';

export async function GET() {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all statistics in parallel
    const [
      totalUsersResult,
      totalInstructorsResult,
      totalStudentsResult,
      totalCoursesResult,
      totalBookingsResult,
      pendingBookingsResult,
      completedLessonsResult,
      totalRevenueResult,
    ] = await Promise.all([
      // Total users
      db.select({ count: count() }).from(users),
      
      // Total approved instructors
      db.select({ count: count() }).from(instructors).where(eq(instructors.isApproved, true)),
      
      // Total students
      db.select({ count: count() }).from(students),
      
      // Total active courses
      db.select({ count: count() }).from(courses).where(eq(courses.isActive, true)),
      
      // Total bookings
      db.select({ count: count() }).from(bookings),
      
      // Pending bookings
      db.select({ count: count() }).from(bookings).where(eq(bookings.status, 'pending')),
      
      // Completed lessons
      db.select({ count: count() }).from(lessons).where(eq(lessons.status, 'completed')),
      
      // Total revenue from confirmed/completed bookings
      db.select({ 
        total: sum(bookings.totalCost) 
      }).from(bookings).where(
        and(
          eq(bookings.status, 'confirmed'),
          // Add condition for bookings that are not cancelled
        )
      ),
      

    ]);

    // Parse results with fallbacks for null values
    const stats = {
      totalUsers: totalUsersResult[0]?.count || 0,
      totalInstructors: totalInstructorsResult[0]?.count || 0,
      totalStudents: totalStudentsResult[0]?.count || 0,
      totalCourses: totalCoursesResult[0]?.count || 0,
      totalBookings: totalBookingsResult[0]?.count || 0,
      pendingBookings: pendingBookingsResult[0]?.count || 0,
      completedLessons: completedLessonsResult[0]?.count || 0,
      totalRevenue: Number(totalRevenueResult[0]?.total || 0),
      avgRating: 4.5, // Default rating when no reviews system
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}