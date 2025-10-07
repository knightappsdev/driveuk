import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { theoryCtaSettings } from '@/lib/db/schema';

// GET - Fetch theory CTA settings for public use (no authentication required)
export async function GET(request: NextRequest) {
  try {
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

    // Only return settings if the section is active
    const ctaSettings = settings[0];
    if (!ctaSettings.isActive) {
      return NextResponse.json({
        success: true,
        data: null // Section is disabled
      });
    }

    return NextResponse.json({
      success: true,
      data: ctaSettings
    });
  } catch (error) {
    console.error('Error fetching theory CTA settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch theory CTA settings' },
      { status: 500 }
    );
  }
}