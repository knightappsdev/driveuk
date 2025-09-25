import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users, instructors } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { eq, and, isNull } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for updates
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
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  isApproved: z.boolean().optional(),
});

// GET: Fetch individual instructor
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
    const instructorId = parseInt(id);
    if (isNaN(instructorId)) {
      return NextResponse.json(
        { error: 'Invalid instructor ID' },
        { status: 400 }
      );
    }

    const [instructor] = await db
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
      })
      .from(instructors)
      .innerJoin(users, eq(instructors.userId, users.id))
      .where(and(
        eq(instructors.id, instructorId),
        isNull(users.deletedAt)
      ))
      .limit(1);

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(instructor);

  } catch (error) {
    console.error('Instructor fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructor' },
      { status: 500 }
    );
  }
}

// PUT: Update instructor
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
    const instructorId = parseInt(id);
    if (isNaN(instructorId)) {
      return NextResponse.json(
        { error: 'Invalid instructor ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateInstructorSchema.parse(body);

    // Check if instructor exists
    const [existingInstructor] = await db
      .select({ 
        id: instructors.id, 
        userId: instructors.userId,
        licenseNumber: instructors.licenseNumber 
      })
      .from(instructors)
      .innerJoin(users, eq(instructors.userId, users.id))
      .where(and(
        eq(instructors.id, instructorId),
        isNull(users.deletedAt)
      ))
      .limit(1);

    if (!existingInstructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
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
          eq(users.id, existingInstructor.userId)
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

    // Check for license number conflicts if license is being updated
    if (validatedData.licenseNumber && validatedData.licenseNumber !== existingInstructor.licenseNumber) {
      const [licenseConflict] = await db
        .select({ id: instructors.id })
        .from(instructors)
        .where(eq(instructors.licenseNumber, validatedData.licenseNumber))
        .limit(1);

      if (licenseConflict) {
        return NextResponse.json(
          { error: 'License number already exists' },
          { status: 400 }
        );
      }
    }

    // Separate user fields from instructor fields
    const userFields = {
      ...(validatedData.name && { name: validatedData.name }),
      ...(validatedData.email && { email: validatedData.email }),
      ...(validatedData.phone !== undefined && { phone: validatedData.phone || null }),
      ...(validatedData.avatar !== undefined && { avatar: validatedData.avatar || null }),
      ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive }),
      updatedAt: new Date(),
    };

    const instructorFields = {
      ...(validatedData.licenseNumber && { licenseNumber: validatedData.licenseNumber }),
      ...(validatedData.experience !== undefined && { experience: validatedData.experience }),
      ...(validatedData.specialties && { specialties: validatedData.specialties }),
      ...(validatedData.transmissionTypes && { transmissionTypes: validatedData.transmissionTypes }),
      ...(validatedData.pricePerHour !== undefined && { pricePerHour: validatedData.pricePerHour.toString() }),
      ...(validatedData.location && { location: validatedData.location }),
      ...(validatedData.bio !== undefined && { bio: validatedData.bio || null }),
      ...(validatedData.availability !== undefined && { availability: validatedData.availability || null }),
      ...(validatedData.languages !== undefined && { languages: validatedData.languages || null }),
      ...(validatedData.nationality !== undefined && { nationality: validatedData.nationality || null }),
      ...(validatedData.religion !== undefined && { religion: validatedData.religion || null }),
      ...(validatedData.ethnicity !== undefined && { ethnicity: validatedData.ethnicity || null }),
      ...(validatedData.gender !== undefined && { gender: validatedData.gender || null }),
      ...(validatedData.isApproved !== undefined && { isApproved: validatedData.isApproved }),
      updatedAt: new Date(),
    };

    // Update user table if there are user field changes
    if (Object.keys(userFields).length > 1) { // > 1 because updatedAt is always present
      await db
        .update(users)
        .set(userFields)
        .where(eq(users.id, existingInstructor.userId));
    }

    // Update instructor table if there are instructor field changes
    if (Object.keys(instructorFields).length > 1) { // > 1 because updatedAt is always present
      await db
        .update(instructors)
        .set(instructorFields)
        .where(eq(instructors.id, instructorId));
    }

    // Fetch updated instructor data
    const [updatedInstructor] = await db
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
      })
      .from(instructors)
      .innerJoin(users, eq(instructors.userId, users.id))
      .where(eq(instructors.id, instructorId))
      .limit(1);

    return NextResponse.json({
      message: 'Instructor updated successfully',
      instructor: updatedInstructor,
    });

  } catch (error) {
    console.error('Instructor update error:', error);
    
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
      { error: 'Failed to update instructor' },
      { status: 500 }
    );
  }
}

// DELETE: Delete instructor
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
    const instructorId = parseInt(id);
    if (isNaN(instructorId)) {
      return NextResponse.json(
        { error: 'Invalid instructor ID' },
        { status: 400 }
      );
    }

    // Check if instructor exists and get user ID
    const [existingInstructor] = await db
      .select({ id: instructors.id, userId: instructors.userId })
      .from(instructors)
      .innerJoin(users, eq(instructors.userId, users.id))
      .where(and(
        eq(instructors.id, instructorId),
        isNull(users.deletedAt)
      ))
      .limit(1);

    if (!existingInstructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    // Soft delete the user (which will cascade to hide the instructor)
    await db
      .update(users)
      .set({
        deletedAt: new Date(),
        isActive: false,
      })
      .where(eq(users.id, existingInstructor.userId));

    return NextResponse.json({
      message: 'Instructor deleted successfully',
    });

  } catch (error) {
    console.error('Instructor deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete instructor' },
      { status: 500 }
    );
  }
}