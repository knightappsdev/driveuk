import { NextResponse } from 'next/server';

export const handleApiError = (error: unknown, context: string) => {
  console.error(`Error in ${context}:`, error);
  return NextResponse.json(
    { 
      success: false, 
      error: `Failed to ${context}` 
    },
    { status: 500 }
  );
};

export const createSuccessResponse = (data: any, status = 200) => {
  return NextResponse.json({
    success: true,
    data,
  }, { status });
};