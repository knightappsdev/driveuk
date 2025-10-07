import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { customCourseSettings, customCourseSkills } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { eq } from 'drizzle-orm';

// GET - Fetch custom course settings and skills
export async function GET() {
  try {
    const accessResult = await validateApiAccess();

    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    // Get custom course settings (should be only one record)
    const settings = await db
      .select()
      .from(customCourseSettings)
      .limit(1);

    // Get all active skills
    const skills = await db
      .select()
      .from(customCourseSkills)
      .where(eq(customCourseSkills.isActive, true))
      .orderBy(customCourseSkills.displayOrder, customCourseSkills.name);

    return NextResponse.json({
      success: true,
      data: {
        settings: settings[0] || null,
        skills: skills || []
      }
    });
  } catch (error) {
    console.error('Error fetching custom course data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch custom course data' },
      { status: 500 }
    );
  }
}

// PUT - Update custom course settings
export async function PUT(request: NextRequest) {
  try {
    const accessResult = await validateApiAccess();

    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    const body = await request.json();
    console.log('Updating custom course settings:', body);

    // Validate required fields
    if (!body.title || !body.hourlyRate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, hourlyRate' },
        { status: 400 }
      );
    }

    // Check if settings exist
    const existingSettings = await db
      .select()
      .from(customCourseSettings)
      .limit(1);

    let result;

    if (existingSettings.length > 0) {
      // Update existing settings
      result = await db
        .update(customCourseSettings)
        .set({
          title: body.title,
          description: body.description || null,
          hourlyRate: body.hourlyRate.toString(),
          minHours: body.minHours || 1,
          maxHours: body.maxHours || 10,
          isActive: body.isActive !== undefined ? body.isActive : true,
          cardColor: body.cardColor || 'orange',
          cardIcon: body.cardIcon || 'settings',
          updatedAt: new Date(),
        })
        .where(eq(customCourseSettings.id, existingSettings[0].id))
        .returning();
    } else {
      // Create new settings
      result = await db
        .insert(customCourseSettings)
        .values({
          title: body.title,
          description: body.description || null,
          hourlyRate: body.hourlyRate.toString(),
          minHours: body.minHours || 1,
          maxHours: body.maxHours || 10,
          isActive: body.isActive !== undefined ? body.isActive : true,
          cardColor: body.cardColor || 'orange',
          cardIcon: body.cardIcon || 'settings',
        })
        .returning();
    }

    return NextResponse.json({
      success: true,
      message: 'Custom course settings updated successfully',
      data: result[0],
    });
  } catch (error) {
    console.error('Error updating custom course settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update custom course settings' },
      { status: 500 }
    );
  }
}