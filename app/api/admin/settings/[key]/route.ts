import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { settings } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for updates
const updateSettingSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  description: z.string().optional(),
});

// GET: Fetch individual setting
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { key } = await params;

    const [setting] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    if (!setting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(setting);

  } catch (error) {
    console.error('Setting fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch setting' },
      { status: 500 }
    );
  }
}

// PUT: Update setting
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { key } = await params;
    const body = await request.json();
    const validatedData = updateSettingSchema.parse(body);

    // Check if setting exists
    const [existingSetting] = await db
      .select({ id: settings.id })
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    if (!existingSetting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    // Update setting
    const [updatedSetting] = await db
      .update(settings)
      .set({
        value: validatedData.value,
        description: validatedData.description,
        updatedAt: new Date(),
      })
      .where(eq(settings.key, key))
      .returning();

    return NextResponse.json({
      message: 'Setting updated successfully',
      setting: updatedSetting,
    });

  } catch (error) {
    console.error('Setting update error:', error);
    
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
      { error: 'Failed to update setting' },
      { status: 500 }
    );
  }
}

// DELETE: Delete setting
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { key } = await params;

    // Check if setting exists
    const [existingSetting] = await db
      .select({ id: settings.id })
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    if (!existingSetting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    // Delete setting
    await db
      .delete(settings)
      .where(eq(settings.key, key));

    return NextResponse.json({
      message: 'Setting deleted successfully',
    });

  } catch (error) {
    console.error('Setting deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete setting' },
      { status: 500 }
    );
  }
}