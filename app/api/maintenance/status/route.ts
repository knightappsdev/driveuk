import { NextResponse } from 'next/server';
import { getMaintenanceStatus } from '@/lib/utils/maintenance';

export async function GET() {
  try {
    const status = await getMaintenanceStatus();
    
    return NextResponse.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error checking maintenance status:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check maintenance status'
      },
      { status: 500 }
    );
  }
}