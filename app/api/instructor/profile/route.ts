import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-service';
import { db } from '@/lib/db/drizzle';
import { users, instructors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const updateInstructorProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  city: z.string().optional(),
  // Instructor-specific fields
  hourlyRate: z.string().optional(),
  bio: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  availability: z.string().optional(),
  vehicleDetails: z.string().optional(),
  businessAddress: z.string().optional(),
  businessPostcode: z.string().optional(),
  whatsappNumber: z.string().optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile with instructor details
    const userProfile = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    const instructorProfile = await db.select().from(instructors).where(eq(instructors.userId, user.id)).limit(1);
    
    if (!userProfile.length) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { passwordHash, ...safeUserProfile } = userProfile[0];
    const combinedProfile = {
      ...safeUserProfile,
      instructorDetails: instructorProfile[0] || null
    };
    
    return NextResponse.json({
      success: true,
      data: combinedProfile
    });
  } catch (error) {
    console.error('Instructor profile fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateInstructorProfileSchema.parse(body);

    const { 
      firstName, 
      lastName, 
      phone, 
      city, 
      ...instructorData 
    } = validatedData;

    // Update user table
    const [updatedUser] = await db
      .update(users)
      .set({
        firstName,
        lastName,
        phone,
        city,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning();

    // Update instructor table if data exists
    if (Object.keys(instructorData).length > 0) {
      await db
        .update(instructors)
        .set({
          ...instructorData,
          updatedAt: new Date(),
        })
        .where(eq(instructors.userId, user.id));
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: { ...updatedUser, passwordHash: undefined }
    });
  } catch (error) {
    console.error('Instructor profile update error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}