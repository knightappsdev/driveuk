import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users, instructors, type NewInstructor } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { hashPassword } from '@/lib/auth/session';
import { desc, eq, and, isNull } from 'drizzle-orm';
import { z } from 'zod';

// Validation schemas
const createInstructorSchema = z.object({
  // User fields
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  phone: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  
  // Instructor specific fields
  licenseNumber: z.string().min(1, 'License number is required').max(50),
  experience: z.number().min(0, 'Experience must be positive').max(50),
  specialties: z.array(z.string()).min(1, 'At least one specialty required'),
  transmissionTypes: z.array(z.enum(['manual', 'automatic'])).min(1, 'At least one transmission type required'),
  pricePerHour: z.number().min(1, 'Price must be positive'),
  location: z.string().min(1, 'Location is required').max(100),
  bio: z.string().optional(),
  availability: z.string().optional(),
  languages: z.array(z.string()).optional(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  ethnicity: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
});

const updateInstructorSchema = z.object({
  // User fields
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  
  // Instructor specific fields
  licenseNumber: z.string().min(1).max(50).optional(),
  experience: z.number().min(0).max(50).optional(),
  specialties: z.array(z.string()).optional(),
  transmissionTypes: z.array(z.enum(['manual', 'automatic'])).optional(),
  pricePerHour: z.number().min(1).optional(),
  location: z.string().min(1).max(100).optional(),
  bio: z.string().optional(),
  availability: z.string().optional(),
  languages: z.array(z.string()).optional(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  ethnicity: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Non-binary']).optional(),
  isApproved: z.boolean().optional(),
});

// GET: Fetch all instructors
export async function GET() {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all instructors with user information
    const allInstructors = await db
      .select({
        id: instructors.id,
        userId: instructors.userId,
        licenseNumber: instructors.licenseNumber,
        experience: instructors.experience,
        specialties: instructors.specialties,
        transmissionTypes: instructors.transmissionTypes,
        pricePerHour: instructors.pricePerHour,
        location: instructors.location,
        bio: instructors.bio,
        availability: instructors.availability,
        languages: instructors.languages,
        nationality: instructors.nationality,
        religion: instructors.religion,
        ethnicity: instructors.ethnicity,
        gender: instructors.gender,
        isApproved: instructors.isApproved,
        createdAt: instructors.createdAt,
        updatedAt: instructors.updatedAt,
        // User fields
        userName: users.name,
        userEmail: users.email,
        userPhone: users.phone,
        userAvatar: users.avatar,
        userIsActive: users.isActive,
        userCreatedAt: users.createdAt,
      })
      .from(instructors)
      .innerJoin(users, eq(instructors.userId, users.id))
      .where(isNull(users.deletedAt))
      .orderBy(desc(instructors.createdAt));

    return NextResponse.json(allInstructors);

  } catch (error) {
    console.error('Admin instructors fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructors' },
      { status: 500 }
    );
  }
}

// POST: Create new instructor
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
    const validatedData = createInstructorSchema.parse(body);

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

    // Check if license number already exists
    const existingInstructor = await db
      .select({ id: instructors.id })
      .from(instructors)
      .where(eq(instructors.licenseNumber, validatedData.licenseNumber))
      .limit(1);

    if (existingInstructor.length > 0) {
      return NextResponse.json(
        { error: 'License number already exists' },
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
        role: 'instructor',
        phone: validatedData.phone || null,
        avatar: validatedData.avatar || null,
        isActive: true,
      })
      .returning();

    // Create instructor profile
    const newInstructor: NewInstructor = {
      userId: createdUser.id,
      licenseNumber: validatedData.licenseNumber,
      experience: validatedData.experience,
      specialties: validatedData.specialties,
      transmissionTypes: validatedData.transmissionTypes,
      pricePerHour: validatedData.pricePerHour.toString(),
      location: validatedData.location,
      bio: validatedData.bio || null,
      availability: validatedData.availability || null,
      languages: validatedData.languages || null,
      nationality: validatedData.nationality || null,
      religion: validatedData.religion || null,
      ethnicity: validatedData.ethnicity || null,
      gender: validatedData.gender || null,
      isApproved: false, // Default to not approved
    };

    const [createdInstructor] = await db
      .insert(instructors)
      .values(newInstructor)
      .returning();

    return NextResponse.json(
      { 
        message: 'Instructor created successfully',
        instructor: {
          ...createdInstructor,
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
    console.error('Instructor creation error:', error);
    
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
      { error: 'Failed to create instructor' },
      { status: 500 }
    );
  }
}