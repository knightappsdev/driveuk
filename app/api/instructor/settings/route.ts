import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-service';
import { db } from '@/lib/db/drizzle';
import { systemSettings } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const updateInstructorSettingsSchema = z.object({
  enableNotifications: z.boolean().optional(),
  enableEmailNotifications: z.boolean().optional(),
  enableSmsNotifications: z.boolean().optional(),
  autoAcceptBookings: z.boolean().optional(),
  workingHours: z.object({
    monday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }).optional(),
    tuesday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }).optional(),
    wednesday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }).optional(),
    thursday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }).optional(),
    friday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }).optional(),
    saturday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }).optional(),
    sunday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }).optional(),
  }).optional(),
  defaultLessonDuration: z.number().optional(),
  bufferTimeBetweenLessons: z.number().optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get instructor-specific settings
    const settings = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.category, `instructor_${user.id}`));

    // Convert to key-value format
    const settingsData = settings.reduce((acc, setting) => {
      try {
        acc[setting.key] = JSON.parse(setting.value);
      } catch {
        acc[setting.key] = setting.value;
      }
      return acc;
    }, {} as Record<string, any>);

    // Default values if no settings exist
    const defaultSettings = {
      enableNotifications: true,
      enableEmailNotifications: true,
      enableSmsNotifications: false,
      autoAcceptBookings: false,
      workingHours: {
        monday: { start: '09:00', end: '17:00', enabled: true },
        tuesday: { start: '09:00', end: '17:00', enabled: true },
        wednesday: { start: '09:00', end: '17:00', enabled: true },
        thursday: { start: '09:00', end: '17:00', enabled: true },
        friday: { start: '09:00', end: '17:00', enabled: true },
        saturday: { start: '09:00', end: '15:00', enabled: true },
        sunday: { start: '10:00', end: '14:00', enabled: false },
      },
      defaultLessonDuration: 60,
      bufferTimeBetweenLessons: 15,
    };

    return NextResponse.json({
      success: true,
      data: { ...defaultSettings, ...settingsData }
    });
  } catch (error) {
    console.error('Instructor settings fetch error:', error);
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
    const validatedData = updateInstructorSettingsSchema.parse(body);

    const category = `instructor_${user.id}`;

    // Update or create settings
    for (const [key, value] of Object.entries(validatedData)) {
      const serializedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      
      // Check if setting exists
      const existingSetting = await db
        .select()
        .from(systemSettings)
        .where(and(
          eq(systemSettings.key, key),
          eq(systemSettings.category, category)
        ))
        .limit(1);

      if (existingSetting.length > 0) {
        // Update existing setting
        await db
          .update(systemSettings)
          .set({
            value: serializedValue,
            updatedAt: new Date(),
          })
          .where(and(
            eq(systemSettings.key, key),
            eq(systemSettings.category, category)
          ));
      } else {
        // Create new setting
        await db.insert(systemSettings).values({
          key,
          value: serializedValue,
          category,
          description: `Instructor setting for ${key}`,
          isPublic: false,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Instructor settings update error:', error);
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