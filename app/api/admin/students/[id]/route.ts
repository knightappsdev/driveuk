import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users, students } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { eq, and, isNull } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for updates
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

// GET: Fetch individual student
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
    const studentId = parseInt(id);
    if (isNaN(studentId)) {
      return NextResponse.json(
        { error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    const [student] = await db
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
      })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .where(and(
        eq(students.id, studentId),
        isNull(users.deletedAt)
      ))
      .limit(1);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(student);

  } catch (error) {
    console.error('Student fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

// PUT: Update student
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
    const studentId = parseInt(id);
    if (isNaN(studentId)) {
      return NextResponse.json(
        { error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateStudentSchema.parse(body);

    // Check if student exists
    const [existingStudent] = await db
      .select({ 
        id: students.id, 
        userId: students.userId 
      })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .where(and(
        eq(students.id, studentId),
        isNull(users.deletedAt)
      ))
      .limit(1);

    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Check for email conflicts if email is being updated
    if (validatedData.email) {
      const [emailConflict] = await db
        .select({ id: users.id })
        .from(users)
        .where(and(
          eq(users.email, validatedData.email),
          eq(users.id, existingStudent.userId)
        ))
        .limit(1);

      if (!emailConflict) {
        const [otherEmailUser] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, validatedData.email))
          .limit(1);

        if (otherEmailUser) {
          return NextResponse.json(
            { error: 'Email already exists' },
            { status: 400 }
          );
        }
      }
    }

    // Separate user fields from student fields
    const userFields = {
      ...(validatedData.name && { name: validatedData.name }),
      ...(validatedData.email && { email: validatedData.email }),
      ...(validatedData.phone !== undefined && { phone: validatedData.phone || null }),
      ...(validatedData.avatar !== undefined && { avatar: validatedData.avatar || null }),
      ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive }),
      updatedAt: new Date(),
    };

    const studentFields = {
      ...(validatedData.dateOfBirth !== undefined && { 
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null 
      }),
      ...(validatedData.address !== undefined && { address: validatedData.address || null }),
      ...(validatedData.emergencyContact !== undefined && { emergencyContact: validatedData.emergencyContact || null }),
      ...(validatedData.licenseStatus && { licenseStatus: validatedData.licenseStatus }),
      ...(validatedData.medicalConditions !== undefined && { medicalConditions: validatedData.medicalConditions || null }),
      updatedAt: new Date(),
    };

    // Update user table if there are user field changes
    if (Object.keys(userFields).length > 1) {
      await db
        .update(users)
        .set(userFields)
        .where(eq(users.id, existingStudent.userId));
    }

    // Update student table if there are student field changes
    if (Object.keys(studentFields).length > 1) {
      await db
        .update(students)
        .set(studentFields)
        .where(eq(students.id, studentId));
    }

    // Fetch updated student data
    const [updatedStudent] = await db
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
      })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .where(eq(students.id, studentId))
      .limit(1);

    return NextResponse.json({
      message: 'Student updated successfully',
      student: updatedStudent,
    });

  } catch (error) {
    console.error('Student update error:', error);
    
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
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

// DELETE: Delete student
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
    const studentId = parseInt(id);
    if (isNaN(studentId)) {
      return NextResponse.json(
        { error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    // Check if student exists and get user ID
    const [existingStudent] = await db
      .select({ id: students.id, userId: students.userId })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .where(and(
        eq(students.id, studentId),
        isNull(users.deletedAt)
      ))
      .limit(1);

    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Soft delete the user (which will cascade to hide the student)
    await db
      .update(users)
      .set({
        deletedAt: new Date(),
        isActive: false,
      })
      .where(eq(users.id, existingStudent.userId));

    return NextResponse.json({
      message: 'Student deleted successfully',
    });

  } catch (error) {
    console.error('Student deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}