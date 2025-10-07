import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { courses } from '@/lib/db/schema';
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

    const coursesData = await db
      .select()
      .from(courses)
      .orderBy(courses.title);

    // Map database fields to interface fields
    const mappedCourses = coursesData.map(course => ({
      ...course,
      totalHours: Math.round(course.duration / 60), // Convert minutes to hours
      studentCount: course.enrolledStudents || 0,
      features: [], // Default empty array since this field doesn't exist in DB
      color: '#3B82F6', // Default color
      isRecommended: course.isRecommended || false, // Use actual database value
      price: course.price.toString(), // Convert decimal to string
    }));

    return NextResponse.json({
      success: true,
      data: mappedCourses,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessResult = await validateApiAccess();

    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    const body = await request.json();
    console.log('Creating new course with data:', body);

    // Validate required fields
    if (!body.title || !body.description || !body.level) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, description, level' },
        { status: 400 }
      );
    }

    // Create course record
    const newCourse = await db
      .insert(courses)
      .values({
        title: body.title,
        description: body.description || null,
        level: body.level,
        duration: body.duration || 60,
        price: body.price ? body.price.toString() : '0.00',
        maxStudents: body.maxStudents || 1,
        enrolledStudents: body.enrolledStudents || 0,
        transmissionType: body.transmissionType || 'manual',
        isActive: body.isActive !== undefined ? body.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      data: newCourse[0],
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
