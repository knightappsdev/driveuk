import { NextRequest } from 'next/server';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { fetchStudentsData } from './lib/database';
import { handleApiError, createSuccessResponse } from './lib/responses';
import { db } from '@/lib/db/drizzle';
import { students, users } from '@/lib/db/schema';

export async function GET() {
  try {
    await validateApiAccess();
    const studentsData = await fetchStudentsData();
    return createSuccessResponse(studentsData);
  } catch (error) {
    return handleApiError(error, 'fetch students');
  }
}

export async function POST(request: NextRequest) {
  try {
    await validateApiAccess();
    const body = await request.json();
    console.log('Creating new student with password hash:', body);

    // Generate a default password hash for admin-created students
    const bcrypt = await import('bcryptjs');
    const defaultPassword = 'TempPassword123!';
    const passwordHash = await bcrypt.hash(defaultPassword, 12);

    // Create user first
    const userResult = await db
      .insert(users)
      .values({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        passwordHash,
        phone: body.phone || null,
        city: body.city || null,
        role: 'student',
        isActive: body.isActive !== undefined ? body.isActive : true,
      })
      .returning({ id: users.id });

    const userId = userResult[0].id;

    // Create student record
    await db
      .insert(students)
      .values({
        userId: userId,
        licenseType: body.licenseType || 'none',
        licenseNumber: body.licenseNumber || null,
        theoryTestPassed: body.theoryTestPassed || false,
        theoryTestDate: body.theoryTestDate || null,
        practicalTestDate: body.practicalTestDate || null,
        practicalTestPassed: body.practicalTestPassed || false,
        dateOfBirth: body.dateOfBirth || null,
        address: body.address || null,
        postcode: body.postcode || null,
        emergencyContact: body.emergencyContact || null,
        medicalConditions: body.medicalConditions || null,
        learningGoals: body.learningGoals || null,
        previousDrivingExperience: body.previousDrivingExperience || null,
        preferredInstructorGender: body.preferredInstructorGender || null,
        preferredLanguage: body.preferredLanguage || 'english',
        drivingLevel: body.drivingLevel || null,
        startDate: body.startDate || null,
      });

    return createSuccessResponse({ message: 'Student created successfully' });
  } catch (error) {
    return handleApiError(error, 'create student');
  }
}
