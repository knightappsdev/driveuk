import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { courses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { validateApiAccess } from '@/lib/auth/auth-helpers';

// GET - Get individual course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const accessResult = await validateApiAccess();
    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    const { id } = await params;
    const courseId = parseInt(id);

    if (isNaN(courseId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    const course = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (course.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: course[0],
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PUT - Update course
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const accessResult = await validateApiAccess();
    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    const { id } = await params;
    const courseId = parseInt(id);

    if (isNaN(courseId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('Updating course with data:', body);

    // Check if this is a status toggle (only one status field) or a full update
    const isStatusToggle = Object.keys(body).length === 1 && 
      (body.hasOwnProperty('isActive') || body.hasOwnProperty('isRecommended'));

    // Validate required fields only for full updates (not for status toggles)
    if (!isStatusToggle && (!body.title || !body.description || !body.level)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, description, level' },
        { status: 400 }
      );
    }

    // Prepare update data based on whether it's a partial or full update
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (isStatusToggle) {
      // For status toggles, only update the specific status field
      if (body.hasOwnProperty('isActive')) {
        updateData.isActive = body.isActive;
      }
      if (body.hasOwnProperty('isRecommended')) {
        updateData.isRecommended = body.isRecommended;
      }
    } else {
      // For full updates, include all fields
      updateData.title = body.title;
      updateData.description = body.description || null;
      updateData.level = body.level;
      updateData.duration = body.duration || 60;
      updateData.price = body.price ? body.price.toString() : '0.00';
      updateData.maxStudents = body.maxStudents || 1;
      updateData.enrolledStudents = body.enrolledStudents || 0;
      updateData.transmissionType = body.transmissionType || 'manual';
      updateData.isActive = body.isActive !== undefined ? body.isActive : true;
      updateData.isRecommended = body.isRecommended !== undefined ? body.isRecommended : false;
    }

    const updatedCourse = await db
      .update(courses)
      .set(updateData)
      .where(eq(courses.id, courseId))
      .returning();

    if (updatedCourse.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse[0],
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const accessResult = await validateApiAccess();
    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    const { id } = await params;
    const courseId = parseInt(id);

    if (isNaN(courseId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    // Check if course exists
    const existingCourse = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (existingCourse.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Delete course
    await db.delete(courses).where(eq(courses.id, courseId));

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}