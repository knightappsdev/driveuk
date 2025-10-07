import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { systemSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { z } from 'zod';

// Validation schemas
const createSettingSchema = z.object({
  key: z.string().min(1, 'Key is required').max(100),
  value: z.string().min(1, 'Value is required'),
  category: z.string().optional().default('general'),
  description: z.string().optional(),
  isPublic: z.boolean().optional().default(false),
});

const updateSettingSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export async function GET() {
  try {
    const accessResult = await validateApiAccess();

    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    const settings = await db
      .select()
      .from(systemSettings)
      .orderBy(systemSettings.category);

    // If no settings exist, create default ones
    let settingsData = settings;
    if (settings.length === 0) {
      const defaultSettings = [
        { category: 'general', key: 'siteName', value: 'DriveUK Driving School', description: 'Site name' },
        { category: 'general', key: 'siteDescription', value: 'Professional driving lessons in the UK', description: 'Site description' },
        { category: 'contact', key: 'contactEmail', value: 'info@driveuk.com', description: 'Contact email' },
        { category: 'contact', key: 'contactPhone', value: '+44 20 1234 5678', description: 'Contact phone' },
        { category: 'contact', key: 'whatsappNumber', value: '+44 7000 123456', description: 'WhatsApp number' },
        { category: 'business', key: 'businessAddress', value: '123 Driving Lane, London, UK', description: 'Business address' },
        { category: 'business', key: 'operatingHours', value: '9:00 AM - 6:00 PM', description: 'Operating hours' },
        { category: 'pricing', key: 'defaultLessonDuration', value: '60', description: 'Default lesson duration (minutes)' },
        { category: 'pricing', key: 'defaultLessonPrice', value: '35.00', description: 'Default lesson price (GBP)' },
        { category: 'features', key: 'enableNotifications', value: 'true', description: 'Enable notifications' },
        { category: 'features', key: 'enableBookings', value: 'true', description: 'Enable online bookings' },
        { category: 'system', key: 'maintenanceMode', value: 'false', description: 'Enable maintenance mode' },
      ];

      await db.insert(systemSettings).values(defaultSettings);
      settingsData = await db.select().from(systemSettings).orderBy(systemSettings.category);
    }

    // Convert to key-value format for easier frontend handling
    const settingsMap = settingsData.reduce((acc: any, setting: any) => {
      if (!acc[setting.category]) {
        acc[setting.category] = {};
      }
      
      acc[setting.category][setting.key] = {
        value: setting.value,
        description: setting.description,
        isPublic: setting.isPublic,
        updatedAt: setting.updatedAt
      };
      
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: settingsMap,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessResult = await validateApiAccess();

    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    const body = await request.json();
    const validatedData = createSettingSchema.parse(body);

    const [newSetting] = await db
      .insert(systemSettings)
      .values({
        key: validatedData.key,
        value: validatedData.value,
        category: validatedData.category,
        description: validatedData.description,
        isPublic: validatedData.isPublic,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newSetting,
    });
  } catch (error) {
    console.error('Error creating setting:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create setting' },
      { status: 500 }
    );
  }
}

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
    const { key, ...updateData } = body;
    
    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Setting key is required' },
        { status: 400 }
      );
    }

    const validatedData = updateSettingSchema.parse(updateData);

    // Try to update the setting first
    const [updatedSetting] = await db
      .update(systemSettings)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(systemSettings.key, key))
      .returning();

    // If no setting was updated (doesn't exist), create it
    if (!updatedSetting) {
      const [newSetting] = await db
        .insert(systemSettings)
        .values({
          key,
          ...validatedData,
          category: 'general', // Default category for new settings
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return NextResponse.json({
        success: true,
        data: newSetting,
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedSetting,
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update setting' },
      { status: 500 }
    );
  }
}
