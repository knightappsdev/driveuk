import { db } from '@/lib/db/drizzle';
import { users, students } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { StudentApiResponse } from './types';

export const fetchStudentsData = async () => {
  return await db
    .select({
      // Student fields
      id: students.id,
      userId: students.userId,
      // License Information
      licenseType: students.licenseType,
      licenseNumber: students.licenseNumber,
      theoryTestPassed: students.theoryTestPassed,
      theoryTestDate: students.theoryTestDate,
      practicalTestDate: students.practicalTestDate,
      practicalTestPassed: students.practicalTestPassed,
      // Personal Information
      dateOfBirth: students.dateOfBirth,
      address: students.address,
      postcode: students.postcode,
      emergencyContact: students.emergencyContact,
      medicalConditions: students.medicalConditions,
      // Learning Information
      learningGoals: students.learningGoals,
      previousDrivingExperience: students.previousDrivingExperience,
      preferredInstructorGender: students.preferredInstructorGender,
      preferredLanguage: students.preferredLanguage,
      drivingLevel: students.drivingLevel,
      startDate: students.startDate,
      // Timestamps
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
    .orderBy(students.createdAt);
};