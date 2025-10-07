import { NextRequest } from 'next/server';
import { fetchInstructorsData, mapInstructorData, checkUserExists, checkAdiBadgeExists, createNewUser, createNewInstructor } from './lib/database';
import { handleApiError, createSuccessResponse, createErrorResponse } from './lib/responses';
import { CreateUserRequest, CreateInstructorRequest } from './lib/types';

export async function GET() {
  try {
    const instructorsData = await fetchInstructorsData();
    
    console.log('Raw instructors data:', instructorsData);

    // Handle empty results
    if (!instructorsData || instructorsData.length === 0) {
      return createSuccessResponse([]);
    }

    const mappedInstructors = mapInstructorData(instructorsData);
    console.log('Mapped instructors:', mappedInstructors);

    return createSuccessResponse(mappedInstructors);
  } catch (error) {
    return handleApiError(error, 'fetch instructors');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is instructor creation (has ADI details) or just user creation
    const isInstructorCreation = body.adiBadgeNumber && body.adiGrade && body.yearsExperience && body.hourlyRate && body.baseCity;
    
    if (isInstructorCreation) {
      // Create instructor with profile
      const instructorData: CreateInstructorRequest = body;
      
      // Check if user already exists
      const userExists = await checkUserExists(instructorData.email);
      
      if (userExists) {
        return createErrorResponse('User with this email already exists');
      }

      // Check if ADI badge number already exists
      const badgeExists = await checkAdiBadgeExists(instructorData.adiBadgeNumber);
      
      if (badgeExists) {
        return createErrorResponse('ADI badge number already exists');
      }

      // Create new instructor with complete profile
      const newInstructor = await createNewInstructor({
        // User fields
        email: instructorData.email,
        firstName: instructorData.firstName,
        lastName: instructorData.lastName,
        phone: instructorData.phone,
        city: instructorData.city,
        
        // Instructor fields
        adiBadgeNumber: instructorData.adiBadgeNumber,
        adiGrade: instructorData.adiGrade,
        yearsExperience: instructorData.yearsExperience,
        hourlyRate: instructorData.hourlyRate,
        specialties: instructorData.specialties || [],
        instructorSummary: instructorData.instructorSummary,
        qualifications: instructorData.qualifications,
        weeklyAvailability: instructorData.weeklyAvailability,
        availability: instructorData.availability,
        baseCity: instructorData.baseCity,
        businessAddress: instructorData.businessAddress,
        businessPostcode: instructorData.businessPostcode,
        whatsappNumber: instructorData.whatsappNumber,
        vehicleDetails: instructorData.vehicleDetails,
        carMake: instructorData.carMake,
        carModel: instructorData.carModel,
        carYear: instructorData.carYear,
        carType: instructorData.carType,
        carFuelType: instructorData.carFuelType,
        vehicleRegistration: instructorData.vehicleRegistration,
        transmissionTypes: instructorData.transmissionTypes,
        insuranceCompany: instructorData.insuranceCompany,
        insurancePolicyNumber: instructorData.insurancePolicyNumber,
        ethnicity: instructorData.ethnicity,
        religion: instructorData.religion,
        bio: instructorData.bio,
        teachingExpertise: instructorData.teachingExpertise,
        adiNumber: instructorData.adiNumber,
      });
      
      return createSuccessResponse(newInstructor.combined, 201);
    } else {
      // Create user only (backwards compatibility)
      const userData: CreateUserRequest = body;
      const { email, firstName, lastName, phone, role, city } = userData;

      // Check if user already exists
      const userExists = await checkUserExists(email);
      
      if (userExists) {
        return createErrorResponse('User with this email already exists');
      }

      // Create new user
      const newUser = await createNewUser({
        email,
        firstName,
        lastName,
        phone,
        role: role as 'admin' | 'instructor' | 'student',
        city,
      });
      
      return createSuccessResponse(newUser, 201);
    }
  } catch (error) {
    return handleApiError(error, 'create instructor');
  }
}