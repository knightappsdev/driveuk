import { db } from '@/lib/db/drizzle';
import { users, instructors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { InstructorApiResponse } from './types';

export const fetchInstructorsData = async (): Promise<any[]> => {
  // Query instructors with approval status
  return await db
    .select({
      id: instructors.id,
      userId: instructors.userId,
      adiBadgeNumber: instructors.adiBadgeNumber,
      adiGrade: instructors.adiGrade,
      yearsExperience: instructors.yearsExperience,
      hourlyRate: instructors.hourlyRate,
      weeklyAvailability: instructors.weeklyAvailability,
      instructorSummary: instructors.instructorSummary,
      qualifications: instructors.qualifications,
      baseCity: instructors.baseCity,
      businessAddress: instructors.businessAddress,
      isActive: instructors.isActive,
      isApproved: instructors.isApproved,
      bio: instructors.bio,
      teachingExpertise: instructors.teachingExpertise,
      adiNumber: instructors.adiNumber,
      createdAt: instructors.createdAt,
      updatedAt: instructors.updatedAt,
      // User fields
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
      city: users.city,
      userIsActive: users.isActive,
      role: users.role,
    })
    .from(instructors)
    .leftJoin(users, eq(instructors.userId, users.id));
};

export const mapInstructorData = (instructorsData: any[]): InstructorApiResponse[] => {
  return instructorsData.map(instructor => ({
    ...instructor,
    // Frontend expected fields
    userName: `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim(),
    userEmail: instructor.email || '',
    userPhone: instructor.phone || '',
    userAvatar: null,
    userIsActive: instructor.userIsActive || false,
    userCreatedAt: instructor.createdAt,
    
    // Map database fields to frontend-expected names for compatibility
    licenseNumber: instructor.adiBadgeNumber || '',
    experience: instructor.yearsExperience || 0,
    specialties: [],
    transmissionTypes: [],
    pricePerHour: instructor.hourlyRate || '0.00',
    location: instructor.baseCity || '',
    bio: instructor.instructorSummary || '',
    availability: JSON.stringify(instructor.weeklyAvailability || {}),
    languages: [],
    nationality: '',
    religion: '',
    ethnicity: '',
    gender: '',
    isApproved: instructor.isApproved || false,
  }));
};

export const checkUserExists = async (email: string): Promise<boolean> => {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  return existingUser.length > 0;
};

export const checkAdiBadgeExists = async (adiBadgeNumber: string): Promise<boolean> => {
  const existingBadge = await db
    .select()
    .from(instructors)
    .where(eq(instructors.adiBadgeNumber, adiBadgeNumber))
    .limit(1);
  
  return existingBadge.length > 0;
};

export const createNewUser = async (userData: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'instructor' | 'student';
  city?: string;
}) => {
  const bcrypt = await import('bcryptjs');
  const defaultPassword = 'TempPassword123!';
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  const [newUser] = await db
    .insert(users)
    .values({
      email: userData.email,
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role,
      city: userData.city,
      isActive: true,
      isEmailVerified: false,
    })
    .returning();

  // Return user without password hash
  const { passwordHash: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const createNewInstructor = async (instructorData: {
  // User data
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
  
  // Instructor data
  adiBadgeNumber: string;
  adiGrade: 'grade_4' | 'grade_5' | 'grade_6' | 'trainee';
  yearsExperience: number;
  hourlyRate: number;
  specialties: string[];
  instructorSummary?: string;
  qualifications?: string;
  weeklyAvailability?: any;
  availability?: string;
  baseCity: string;
  businessAddress?: string;
  businessPostcode?: string;
  whatsappNumber?: string;
  vehicleDetails?: string;
  carMake?: string;
  carModel?: string;
  carYear?: number;
  carType?: 'manual' | 'automatic';
  carFuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  vehicleRegistration?: string;
  transmissionTypes?: string[];
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  ethnicity?: string;
  religion?: string;
  bio?: string;
  teachingExpertise?: string;
  adiNumber?: string;
}) => {
  // Validate required fields
  if (!instructorData.email || !instructorData.firstName || !instructorData.lastName) {
    throw new Error('Missing required user fields: email, firstName, and lastName are required');
  }
  
  if (!instructorData.adiBadgeNumber || !instructorData.adiGrade || !instructorData.yearsExperience || !instructorData.hourlyRate || !instructorData.baseCity) {
    throw new Error('Missing required instructor fields: adiBadgeNumber, adiGrade, yearsExperience, hourlyRate, and baseCity are required');
  }

  // First create the user
  const newUser = await createNewUser({
    email: instructorData.email,
    firstName: instructorData.firstName,
    lastName: instructorData.lastName,
    phone: instructorData.phone,
    role: 'instructor',
    city: instructorData.city,
  });

  // Then create the instructor profile
  const [newInstructor] = await db
    .insert(instructors)
    .values({
      userId: newUser.id,
      adiBadgeNumber: instructorData.adiBadgeNumber,
      adiGrade: instructorData.adiGrade,
      yearsExperience: instructorData.yearsExperience,
      hourlyRate: instructorData.hourlyRate.toString(),
      specialties: instructorData.specialties || [],
      instructorSummary: instructorData.instructorSummary?.trim() || null,
      qualifications: instructorData.qualifications?.trim() || null,
      weeklyAvailability: instructorData.weeklyAvailability || null,
      availability: instructorData.availability?.trim() || null,
      baseCity: instructorData.baseCity.trim(),
      businessAddress: instructorData.businessAddress?.trim() || null,
      businessPostcode: instructorData.businessPostcode?.trim() || null,
      whatsappNumber: instructorData.whatsappNumber?.trim() || null,
      vehicleDetails: instructorData.vehicleDetails?.trim() || null,
      carMake: instructorData.carMake?.trim() || null,
      carModel: instructorData.carModel?.trim() || null,
      carYear: instructorData.carYear || null,
      carType: instructorData.carType || null,
      carFuelType: instructorData.carFuelType || null,
      vehicleRegistration: instructorData.vehicleRegistration?.trim() || null,
      transmissionTypes: instructorData.transmissionTypes || null,
      insuranceCompany: instructorData.insuranceCompany?.trim() || null,
      insurancePolicyNumber: instructorData.insurancePolicyNumber?.trim() || null,
      ethnicity: instructorData.ethnicity?.trim() || null,
      religion: instructorData.religion?.trim() || null,
      bio: instructorData.bio?.trim() || null,
      teachingExpertise: instructorData.teachingExpertise?.trim() || null,
      adiNumber: instructorData.adiNumber?.trim() || null,
      isActive: true,
    })
    .returning();

  // Return complete instructor data
  return {
    user: newUser,
    instructor: newInstructor,
    combined: {
      // Use instructor ID and userId from instructor record
      ...newInstructor,
      // Add user details
      userName: `${newUser.firstName} ${newUser.lastName}`.trim(),
      userEmail: newUser.email,
      userPhone: newUser.phone || '',
      userIsActive: newUser.isActive,
      userCreatedAt: newUser.createdAt,
    }
  };
};