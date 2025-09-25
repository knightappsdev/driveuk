import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { settings, type NewSetting } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

// Validation schemas
const createSettingSchema = z.object({
  key: z.string().min(1, 'Key is required').max(100),
  value: z.string().min(1, 'Value is required'),
  description: z.string().optional(),
});

const updateSettingSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  description: z.string().optional(),
});

// GET: Fetch all settings
export async function GET() {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all settings
    const allSettings = await db
      .select()
      .from(settings)
      .orderBy(settings.key);

    return NextResponse.json(allSettings);

  } catch (error) {
    console.error('Admin settings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST: Create new setting
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
    const validatedData = createSettingSchema.parse(body);

    // Check if setting key already exists
    const existingSetting = await db
      .select({ id: settings.id })
      .from(settings)
      .where(eq(settings.key, validatedData.key))
      .limit(1);

    if (existingSetting.length > 0) {
      return NextResponse.json(
        { error: 'Setting key already exists' },
        { status: 400 }
      );
    }

    // Create new setting
    const newSetting: NewSetting = {
      key: validatedData.key,
      value: validatedData.value,
      description: validatedData.description || null,
    };

    const [createdSetting] = await db
      .insert(settings)
      .values(newSetting)
      .returning();

    return NextResponse.json(
      { 
        message: 'Setting created successfully',
        setting: createdSetting 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Setting creation error:', error);
    
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
      { error: 'Failed to create setting' },
      { status: 500 }
    );
  }
}