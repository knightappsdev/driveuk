import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { courses } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for updates
const updateCourseSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  level: z.enum(['absolute-beginner', 'beginner', 'intermediate', 'advanced']).optional(),
  totalHours: z.number().min(1).max(200).optional(),
  price: z.number().min(1).optional(),
  features: z.array(z.string()).optional(),
  color: z.string().optional(),
  isRecommended: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// GET: Fetch individual course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const courseId = parseInt(id);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);

  } catch (error) {
    console.error('Course fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PUT: Update course
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const courseId = parseInt(id);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateCourseSchema.parse(body);

    // Check if course exists
    const [existingCourse] = await db
      .select({ id: courses.id, title: courses.title })
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check for title conflicts if title is being updated
    if (validatedData.title && validatedData.title !== existingCourse.title) {
      const [titleConflict] = await db
        .select({ id: courses.id })
        .from(courses)
        .where(eq(courses.title, validatedData.title))
        .limit(1);

      if (titleConflict) {
        return NextResponse.json(
          { error: 'Course title already exists' },
          { status: 400 }
        );
      }
    }

    // Update course
    const updateData: any = {
      ...(validatedData.title && { title: validatedData.title }),
      ...(validatedData.description && { description: validatedData.description }),
      ...(validatedData.level && { level: validatedData.level }),
      ...(validatedData.totalHours && { totalHours: validatedData.totalHours }),
      ...(validatedData.price && { price: validatedData.price.toString() }),
      ...(validatedData.features && { features: validatedData.features }),
      ...(validatedData.color && { color: validatedData.color }),
      ...(validatedData.isRecommended !== undefined && { isRecommended: validatedData.isRecommended }),
      ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive }),
      updatedAt: new Date(),
    };

    const [updatedCourse] = await db
      .update(courses)
      .set(updateData)
      .where(eq(courses.id, courseId))
      .returning();

    return NextResponse.json({
      message: 'Course updated successfully',
      course: updatedCourse,
    });

  } catch (error) {
    console.error('Course update error:', error);
    
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
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE: Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const courseId = parseInt(id);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    // Check if course exists
    const [existingCourse] = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false instead of hard delete
    // This preserves course data for existing bookings
    await db
      .update(courses)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId));

    return NextResponse.json({
      message: 'Course deleted successfully',
    });

  } catch (error) {
    console.error('Course deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}