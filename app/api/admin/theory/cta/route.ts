import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { theoryCtaSettings } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { eq } from 'drizzle-orm';

// GET - Fetch theory CTA settings
export async function GET(request: NextRequest) {
  try {
    const accessResult = await validateApiAccess();
    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    // Get the settings (there should only be one record)
    const settings = await db
      .select()
      .from(theoryCtaSettings)
      .limit(1);

    // If no settings exist, return default values
    if (settings.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          id: null,
          isActive: true,
          title: 'Pass Your Theory Test Today',
          subtitle: 'Master the DVSA theory test with our comprehensive practice questions. Study all 15 official categories and boost your confidence before the real exam.',
          buttonText: 'Take The Test',
          buttonUrl: '/theory',
          stat1Icon: 'CheckCircle',
          stat1Text: '15 Official DVSA Categories',
          stat1Count: 15,
          stat2Icon: 'BookOpen',
          stat2Text: '50+ Practice Questions',
          stat2Count: 50,
          stat3Icon: 'Star',
          stat3Text: 'Real Exam Experience',
          stat3Count: null,
          footerText: 'Free practice • No registration required',
          backgroundGradientFrom: 'blue-600',
          backgroundGradientVia: 'blue-500',
          backgroundGradientTo: 'green-500',
          showDecorations: true,
          minHeight: 'min-h-96'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: settings[0]
    });
  } catch (error) {
    console.error('Error fetching theory CTA settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch theory CTA settings' },
      { status: 500 }
    );
  }
}

// POST - Create or update theory CTA settings
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
    const {
      isActive,
      title,
      subtitle,
      buttonText,
      buttonUrl,
      stat1Icon,
      stat1Text,
      stat1Count,
      stat2Icon,
      stat2Text,
      stat2Count,
      stat3Icon,
      stat3Text,
      stat3Count,
      footerText,
      backgroundGradientFrom,
      backgroundGradientVia,
      backgroundGradientTo,
      showDecorations,
      minHeight
    } = body;

    // Check if settings already exist
    const existingSettings = await db
      .select()
      .from(theoryCtaSettings)
      .limit(1);

    let result;

    if (existingSettings.length === 0) {
      // Create new settings
      result = await db
        .insert(theoryCtaSettings)
        .values({
          isActive: isActive !== undefined ? isActive : true,
          title: title || 'Pass Your Theory Test Today',
          subtitle: subtitle || 'Master the DVSA theory test with our comprehensive practice questions. Study all 15 official categories and boost your confidence before the real exam.',
          buttonText: buttonText || 'Take The Test',
          buttonUrl: buttonUrl || '/theory',
          stat1Icon: stat1Icon || 'CheckCircle',
          stat1Text: stat1Text || '15 Official DVSA Categories',
          stat1Count: stat1Count || 15,
          stat2Icon: stat2Icon || 'BookOpen',
          stat2Text: stat2Text || '50+ Practice Questions',
          stat2Count: stat2Count || 50,
          stat3Icon: stat3Icon || 'Star',
          stat3Text: stat3Text || 'Real Exam Experience',
          stat3Count: stat3Count || null,
          footerText: footerText || 'Free practice • No registration required',
          backgroundGradientFrom: backgroundGradientFrom || 'blue-600',
          backgroundGradientVia: backgroundGradientVia || 'blue-500',
          backgroundGradientTo: backgroundGradientTo || 'green-500',
          showDecorations: showDecorations !== undefined ? showDecorations : true,
          minHeight: minHeight || 'min-h-96'
        })
        .returning();
    } else {
      // Update existing settings
      result = await db
        .update(theoryCtaSettings)
        .set({
          isActive: isActive !== undefined ? isActive : existingSettings[0].isActive,
          title: title !== undefined ? title : existingSettings[0].title,
          subtitle: subtitle !== undefined ? subtitle : existingSettings[0].subtitle,
          buttonText: buttonText !== undefined ? buttonText : existingSettings[0].buttonText,
          buttonUrl: buttonUrl !== undefined ? buttonUrl : existingSettings[0].buttonUrl,
          stat1Icon: stat1Icon !== undefined ? stat1Icon : existingSettings[0].stat1Icon,
          stat1Text: stat1Text !== undefined ? stat1Text : existingSettings[0].stat1Text,
          stat1Count: stat1Count !== undefined ? stat1Count : existingSettings[0].stat1Count,
          stat2Icon: stat2Icon !== undefined ? stat2Icon : existingSettings[0].stat2Icon,
          stat2Text: stat2Text !== undefined ? stat2Text : existingSettings[0].stat2Text,
          stat2Count: stat2Count !== undefined ? stat2Count : existingSettings[0].stat2Count,
          stat3Icon: stat3Icon !== undefined ? stat3Icon : existingSettings[0].stat3Icon,
          stat3Text: stat3Text !== undefined ? stat3Text : existingSettings[0].stat3Text,
          stat3Count: stat3Count !== undefined ? stat3Count : existingSettings[0].stat3Count,
          footerText: footerText !== undefined ? footerText : existingSettings[0].footerText,
          backgroundGradientFrom: backgroundGradientFrom !== undefined ? backgroundGradientFrom : existingSettings[0].backgroundGradientFrom,
          backgroundGradientVia: backgroundGradientVia !== undefined ? backgroundGradientVia : existingSettings[0].backgroundGradientVia,
          backgroundGradientTo: backgroundGradientTo !== undefined ? backgroundGradientTo : existingSettings[0].backgroundGradientTo,
          showDecorations: showDecorations !== undefined ? showDecorations : existingSettings[0].showDecorations,
          minHeight: minHeight !== undefined ? minHeight : existingSettings[0].minHeight,
          updatedAt: new Date()
        })
        .where(eq(theoryCtaSettings.id, existingSettings[0].id))
        .returning();
    }

    return NextResponse.json({
      success: true,
      message: 'Theory CTA settings saved successfully',
      data: result[0]
    });
  } catch (error) {
    console.error('Error saving theory CTA settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save theory CTA settings' },
      { status: 500 }
    );
  }
}

// PUT - Update theory CTA settings (alias for POST)
export async function PUT(request: NextRequest) {
  return POST(request);
}

// DELETE - Reset theory CTA settings to defaults
export async function DELETE(request: NextRequest) {
  try {
    const accessResult = await validateApiAccess();
    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    // Delete all existing settings
    await db.delete(theoryCtaSettings);

    return NextResponse.json({
      success: true,
      message: 'Theory CTA settings reset to defaults'
    });
  } catch (error) {
    console.error('Error resetting theory CTA settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset theory CTA settings' },
      { status: 500 }
    );
  }
}