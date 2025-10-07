import { NextRequest, NextResponse } from 'next/server';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { db } from '@/lib/db/drizzle';
import { students, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// GET - Fetch single student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await validateApiAccess();
    const { id } = await params;
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    const student = await db
      .select({
        // Student fields
        id: students.id,
        userId: students.userId,
        licenseType: students.licenseType,
        licenseNumber: students.licenseNumber,
        theoryTestPassed: students.theoryTestPassed,
        theoryTestDate: students.theoryTestDate,
        practicalTestDate: students.practicalTestDate,
        practicalTestPassed: students.practicalTestPassed,
        dateOfBirth: students.dateOfBirth,
        address: students.address,
        postcode: students.postcode,
        emergencyContact: students.emergencyContact,
        medicalConditions: students.medicalConditions,
        learningGoals: students.learningGoals,
        previousDrivingExperience: students.previousDrivingExperience,
        preferredInstructorGender: students.preferredInstructorGender,
        preferredLanguage: students.preferredLanguage,
        drivingLevel: students.drivingLevel,
        startDate: students.startDate,
        createdAt: students.createdAt,
        updatedAt: students.updatedAt,
        // User fields
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
        city: users.city,
        isActive: users.isActive,
        role: users.role,
      })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .where(eq(students.id, studentId))
      .limit(1);

    if (student.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student[0]
    });

  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

// PUT - Update student
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await validateApiAccess();
    const { id } = await params;
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('Updating student:', studentId, body);

    // Check if student exists
    const existingStudent = await db
      .select({ id: students.id, userId: students.userId })
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (existingStudent.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    const userId = existingStudent[0].userId;

    // Update student data
    const studentUpdateData: any = {};
    if (body.licenseType !== undefined) studentUpdateData.licenseType = body.licenseType;
    if (body.licenseNumber !== undefined) studentUpdateData.licenseNumber = body.licenseNumber;
    if (body.theoryTestPassed !== undefined) studentUpdateData.theoryTestPassed = body.theoryTestPassed;
    if (body.theoryTestDate !== undefined) studentUpdateData.theoryTestDate = body.theoryTestDate || null;
    if (body.practicalTestDate !== undefined) studentUpdateData.practicalTestDate = body.practicalTestDate || null;
    if (body.practicalTestPassed !== undefined) studentUpdateData.practicalTestPassed = body.practicalTestPassed;
    if (body.dateOfBirth !== undefined) studentUpdateData.dateOfBirth = body.dateOfBirth || null;
    if (body.address !== undefined) studentUpdateData.address = body.address;
    if (body.postcode !== undefined) studentUpdateData.postcode = body.postcode;
    if (body.emergencyContact !== undefined) studentUpdateData.emergencyContact = body.emergencyContact;
    if (body.medicalConditions !== undefined) studentUpdateData.medicalConditions = body.medicalConditions;
    if (body.learningGoals !== undefined) studentUpdateData.learningGoals = body.learningGoals;
    if (body.previousDrivingExperience !== undefined) studentUpdateData.previousDrivingExperience = body.previousDrivingExperience;
    if (body.preferredInstructorGender !== undefined) studentUpdateData.preferredInstructorGender = body.preferredInstructorGender;
    if (body.preferredLanguage !== undefined) studentUpdateData.preferredLanguage = body.preferredLanguage;
    if (body.drivingLevel !== undefined) studentUpdateData.drivingLevel = body.drivingLevel;
    if (body.startDate !== undefined) studentUpdateData.startDate = body.startDate || null;

    // Update user data
    const userUpdateData: any = {};
    if (body.firstName !== undefined) userUpdateData.firstName = body.firstName;
    if (body.lastName !== undefined) userUpdateData.lastName = body.lastName;
    if (body.email !== undefined) userUpdateData.email = body.email;
    if (body.phone !== undefined) userUpdateData.phone = body.phone;
    if (body.city !== undefined) userUpdateData.city = body.city;
    if (body.isActive !== undefined) userUpdateData.isActive = body.isActive;

    // Update student record if there's student data to update
    if (Object.keys(studentUpdateData).length > 0) {
      studentUpdateData.updatedAt = new Date();
      await db
        .update(students)
        .set(studentUpdateData)
        .where(eq(students.id, studentId));
    }

    // Update user record if there's user data to update
    if (Object.keys(userUpdateData).length > 0) {
      await db
        .update(users)
        .set(userUpdateData)
        .where(eq(users.id, userId));
    }

    return NextResponse.json({
      success: true,
      message: 'Student updated successfully'
    });

  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

// DELETE - Delete student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await validateApiAccess();
    const { id } = await params;
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    console.log('Deleting student:', studentId);

    // Check if student exists and get the userId
    const existingStudent = await db
      .select({ id: students.id, userId: students.userId })
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (existingStudent.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    const userId = existingStudent[0].userId;

    // Delete student record first (due to foreign key constraint)
    await db.delete(students).where(eq(students.id, studentId));

    // Delete associated user record
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}