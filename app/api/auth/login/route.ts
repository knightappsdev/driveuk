import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth/auth-service';
import { loginSchema } from '@/lib/auth/types';
import { getClientIP, getUserAgent } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input data',
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Get client information
    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);
    
    // Login user
    const loginResult = await loginUser(result.data, ipAddress, userAgent);
    
    if (!loginResult.success) {
      return NextResponse.json(loginResult, { status: 401 });
    }

    return NextResponse.json(loginResult, { status: 200 });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}