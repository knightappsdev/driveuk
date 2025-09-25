import { NextResponse } from 'next/server';
import { 
  drivingInstructors, 
  getInstructorsByLocation, 
  getInstructorsByTransmission,
  searchInstructors 
} from '@/lib/data/instructors';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const transmission = searchParams.get('transmission');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    let instructors = drivingInstructors;

    // Apply filters
    if (location) {
      instructors = getInstructorsByLocation(location);
    }

    if (transmission && ['manual', 'automatic'].includes(transmission)) {
      instructors = getInstructorsByTransmission(transmission as 'manual' | 'automatic');
    }

    if (search) {
      instructors = searchInstructors(search);
    }

    // Apply pagination
    const paginatedInstructors = instructors.slice(offset, offset + limit);
    const total = instructors.length;

    return NextResponse.json({ 
      instructors: paginatedInstructors,
      total,
      hasMore: offset + limit < total
    });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructors' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const instructorData = await request.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'city', 'licenseNumber'];
    for (const field of requiredFields) {
      if (!instructorData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // In a real application, you would:
    // 1. Validate the data more thoroughly
    // 2. Save to database
    // 3. Send confirmation email
    // 4. Trigger background verification process

    console.log('New instructor registration:', instructorData);

    // Simulate processing
    return NextResponse.json({ 
      success: true,
      message: 'Instructor registration received. We will review your application and contact you within 48 hours.',
      applicationId: `APP-${Date.now()}`
    });
  } catch (error) {
    console.error('Error processing instructor registration:', error);
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  }
}