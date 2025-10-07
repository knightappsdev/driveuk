import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { instructors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const instructorId = parseInt(id);
    
    if (isNaN(instructorId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid instructor ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Update instructor approval status
    if (body.hasOwnProperty('isApproved')) {
      const result = await db
        .update(instructors)
        .set({ 
          isApproved: body.isApproved,
          updatedAt: new Date()
        })
        .where(eq(instructors.id, instructorId))
        .returning();

      if (result.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Instructor not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Instructor ${body.isApproved ? 'approved' : 'disapproved'} successfully`,
        data: result[0]
      });
    }

    // Handle other instructor updates (profile info, etc.)
    const updateData: any = {};
    
    // Allow updating specific fields
    const allowedFields = [
      'adiBadgeNumber', 'adiGrade', 'yearsExperience', 'hourlyRate',
      'weeklyAvailability', 'instructorSummary', 'qualifications',
      'baseCity', 'businessAddress', 'isActive', 'bio', 'teachingExpertise',
      'adiNumber', 'isApproved'
    ];

    allowedFields.forEach(field => {
      if (body.hasOwnProperty(field)) {
        updateData[field] = body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid fields to update' },
        { status: 400 }
      );
    }

    updateData.updatedAt = new Date();

    const result = await db
      .update(instructors)
      .set(updateData)
      .where(eq(instructors.id, instructorId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Instructor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Instructor updated successfully',
      data: result[0]
    });

  } catch (error) {
    console.error('Error updating instructor:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const instructorId = parseInt(id);
    
    if (isNaN(instructorId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid instructor ID' },
        { status: 400 }
      );
    }

    // Check if instructor exists
    const existingInstructor = await db
      .select()
      .from(instructors)
      .where(eq(instructors.id, instructorId))
      .limit(1);

    if (existingInstructor.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Instructor not found' },
        { status: 404 }
      );
    }

    // Delete instructor
    await db.delete(instructors).where(eq(instructors.id, instructorId));

    return NextResponse.json({
      success: true,
      message: 'Instructor deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting instructor:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const instructorId = parseInt(id);
    
    if (isNaN(instructorId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid instructor ID' },
        { status: 400 }
      );
    }

    const instructor = await db
      .select()
      .from(instructors)
      .where(eq(instructors.id, instructorId))
      .limit(1);

    if (instructor.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Instructor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: instructor[0]
    });

  } catch (error) {
    console.error('Error fetching instructor:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}