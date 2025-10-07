import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { systemSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get maintenance mode setting from database
    const maintenanceSetting = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, 'maintenanceMode'))
      .limit(1);
    
    const maintenanceMode = maintenanceSetting.length > 0 
      ? maintenanceSetting[0].value === 'true' 
      : false;
    
    return NextResponse.json({ 
      success: true,
      maintenanceMode 
    });
  } catch (error) {
    console.error('Error checking maintenance status:', error);
    return NextResponse.json(
      { success: false, maintenanceMode: false },
      { status: 500 }
    );
  }
}