import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-service';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get full user profile with additional fields
    const profile = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    
    if (!profile.length) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const userProfile = profile[0];
    
    // Remove sensitive fields
    const { passwordHash, ...safeProfile } = userProfile;
    
    return NextResponse.json(safeProfile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Define allowed fields for update
    const allowedFields = [
      'firstName',
      'lastName',
      'phone',
      'dateOfBirth',
      'address',
      'city',
      'postcode',
      'bio',
      'hourlyRate',
      'teachingExpertise',
      'adiNumber'
    ];

    // Filter out disallowed fields
    const updateData: any = {};
    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key) && body[key] !== undefined) {
        updateData[key] = body[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Update user profile
    const result = await db.update(users)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id))
      .returning();

    if (!result.length) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    const { passwordHash, ...safeProfile } = result[0];
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: safeProfile
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}