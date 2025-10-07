import { NextResponse } from 'next/server';

export const handleApiError = (error: unknown, context: string) => {
  console.error(`Error in ${context}:`, error);
  return NextResponse.json(
    { error: `Failed to ${context}` },
    { status: 500 }
  );
};

export const createSuccessResponse = (data: any, status = 200) => {
  return NextResponse.json(data, { status });
};

export const createErrorResponse = (message: string, status = 400) => {
  return NextResponse.json(
    { error: message },
    { status }
  );
};