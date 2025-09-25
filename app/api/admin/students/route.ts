import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users, students, type NewStudent } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { hashPassword } from '@/lib/auth/session';
import { desc, eq, and, isNull } from 'drizzle-orm';
import { z } from 'zod';

// Validation schemas
const createStudentSchema = z.object({
  // User fields
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  phone: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  
  // Student specific fields
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  licenseStatus: z.enum(['none', 'provisional', 'full']).default('none'),
  medicalConditions: z.string().optional(),
});

const updateStudentSchema = z.object({
  // User fields
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  
  // Student specific fields
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  licenseStatus: z.enum(['none', 'provisional', 'full']).optional(),
  medicalConditions: z.string().optional(),
});

// GET: Fetch all students
export async function GET() {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all students with user information
    const allStudents = await db
      .select({
        id: students.id,
        userId: students.userId,
        dateOfBirth: students.dateOfBirth,
        address: students.address,
        emergencyContact: students.emergencyContact,
        licenseStatus: students.licenseStatus,
        medicalConditions: students.medicalConditions,
        createdAt: students.createdAt,
        updatedAt: students.updatedAt,
        // User fields
        userName: users.name,
        userEmail: users.email,
        userPhone: users.phone,
        userAvatar: users.avatar,
        userIsActive: users.isActive,
        userCreatedAt: users.createdAt,
      })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .where(isNull(users.deletedAt))
      .orderBy(desc(students.createdAt));

    return NextResponse.json(allStudents);

  } catch (error) {
    console.error('Admin students fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST: Create new student
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
    const validatedData = createStudentSchema.parse(body);

    // Check if email already exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Create user first
    const passwordHash = await hashPassword(validatedData.password);
    
    const [createdUser] = await db
      .insert(users)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        role: 'student',
        phone: validatedData.phone || null,
        avatar: validatedData.avatar || null,
        isActive: true,
      })
      .returning();

    // Create student profile
    const newStudent: NewStudent = {
      userId: createdUser.id,
      dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
      address: validatedData.address || null,
      emergencyContact: validatedData.emergencyContact || null,
      licenseStatus: validatedData.licenseStatus,
      medicalConditions: validatedData.medicalConditions || null,
    };

    const [createdStudent] = await db
      .insert(students)
      .values(newStudent)
      .returning();

    return NextResponse.json(
      { 
        message: 'Student created successfully',
        student: {
          ...createdStudent,
          userName: createdUser.name,
          userEmail: createdUser.email,
          userPhone: createdUser.phone,
          userAvatar: createdUser.avatar,
          userIsActive: createdUser.isActive,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Student creation error:', error);
    
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
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}