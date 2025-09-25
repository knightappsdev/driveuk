import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { courses, bookings, students, users } from '@/lib/db/schema';
import { eq, count, and, isNull, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');

  try {
    // Fetch courses from database with student counts
    const coursesWithCounts = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        level: courses.level,
        totalHours: courses.totalHours,
        price: courses.price,
        features: courses.features,
        color: courses.color,
        isRecommended: courses.isRecommended,
        isActive: courses.isActive,
        studentCount: count(bookings.id),
      })
      .from(courses)
      .leftJoin(bookings, eq(courses.id, bookings.courseId))
      .leftJoin(students, eq(bookings.studentId, students.id))
      .leftJoin(users, eq(students.userId, users.id))
      .where(and(
        eq(courses.isActive, true),
        isNull(users.deletedAt)
      ))
      .groupBy(courses.id)
      .orderBy(desc(courses.createdAt));

    // Convert to frontend format
    const formattedCourses = coursesWithCounts.map(course => ({
      id: course.id.toString(),
      title: course.title,
      description: course.description,
      level: course.level,
      totalHours: course.totalHours,
      price: parseFloat(course.price),
      features: course.features,
      icon: null, // Will be set by frontend
      color: course.color,
      recommended: course.isRecommended,
      studentCount: course.studentCount,
    }));

    // Filter by level if specified
    if (level && ['absolute-beginner', 'beginner', 'intermediate', 'advanced'].includes(level)) {
      const filteredCourses = formattedCourses.filter(course => course.level === level);
      return NextResponse.json({ courses: filteredCourses });
    }

    return NextResponse.json({ courses: formattedCourses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}