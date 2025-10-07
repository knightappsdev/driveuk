import { NextRequest, NextResponse } from 'next/server';
import { logoutUser } from '@/lib/auth/auth-service';
import { AUTH_CONSTANTS } from '@/lib/auth/types';

export async function POST(request: NextRequest) {
  try {
    await logoutUser();
    
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
    
    // Ensure cookie is cleared in the response
    response.cookies.delete(AUTH_CONSTANTS.COOKIE_NAME);
    
    return response;

  } catch (error) {
    console.error('Logout API error:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
    
    // Clear cookie even on error
    response.cookies.delete(AUTH_CONSTANTS.COOKIE_NAME);
    return response;
  }
}