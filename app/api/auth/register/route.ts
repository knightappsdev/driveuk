import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth/auth-service';
import { registerSchema } from '@/lib/auth/types';
import { getClientIP, getUserAgent } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Registration API - Received data:', JSON.stringify(body, null, 2));
    
    // Validate input
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      console.log('Registration API - Validation failed:', result.error.flatten().fieldErrors);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input data',
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    console.log('Registration API - Validation passed, proceeding with registration');

    // Get client information
    const ipAddress = getClientIP(request);
    
    // Register user
    const registerResult = await registerUser(result.data, ipAddress);
    console.log('Registration API - Registration result:', registerResult);
    
    if (!registerResult.success) {
      console.log('Registration API - Registration failed:', registerResult.message);
      return NextResponse.json(registerResult, { status: 400 });
    }

    console.log('Registration API - Registration successful');
    return NextResponse.json(registerResult, { status: 201 });

  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}