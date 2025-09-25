import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { courses, type NewCourse } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

// Validation schemas
const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required'),
  level: z.enum(['absolute-beginner', 'beginner', 'intermediate', 'advanced']),
  totalHours: z.number().min(1, 'Total hours must be positive').max(200),
  price: z.number().min(1, 'Price must be positive'),
  features: z.array(z.string()).min(1, 'At least one feature required'),
  color: z.string().default('blue'),
  isRecommended: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

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

// GET: Fetch all courses
export async function GET() {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all courses
    const allCourses = await db
      .select()
      .from(courses)
      .orderBy(desc(courses.createdAt));

    return NextResponse.json(allCourses);

  } catch (error) {
    console.error('Admin courses fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST: Create new course
export async function POST(request: NextRequest) {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createCourseSchema.parse(body);

    // Check if course title already exists
    const existingCourse = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.title, validatedData.title))
      .limit(1);

    if (existingCourse.length > 0) {
      return NextResponse.json(
        { error: 'Course title already exists' },
        { status: 400 }
      );
    }

    // Create new course
    const newCourse: NewCourse = {
      title: validatedData.title,
      description: validatedData.description,
      level: validatedData.level,
      totalHours: validatedData.totalHours,
      price: validatedData.price.toString(),
      features: validatedData.features,
      color: validatedData.color,
      isRecommended: validatedData.isRecommended,
      isActive: validatedData.isActive,
    };

    const [createdCourse] = await db
      .insert(courses)
      .values(newCourse)
      .returning();

    return NextResponse.json(
      { 
        message: 'Course created successfully',
        course: createdCourse 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Course creation error:', error);
    
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
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}