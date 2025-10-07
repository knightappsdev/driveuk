import { NextRequest } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { instructors, users } from '@/lib/db/schema';
import { eq, and, like, ilike, or, gte, lte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postcode = searchParams.get('postcode');
    const transmission = searchParams.get('transmission');
    const ethnicity = searchParams.get('ethnicity');
    const religion = searchParams.get('religion');
    const teachingExpertise = searchParams.get('teachingExpertise');
    const priceRange = searchParams.get('priceRange');
    const experience = searchParams.get('experience');
    const carFuelType = searchParams.get('carFuelType');
    const limit = searchParams.get('limit') || '12';

    // Build filters
    const filters = [];
    
    // Base filters - only active and approved instructors
    filters.push(eq(instructors.isActive, true));
    filters.push(eq(instructors.isApproved, true));
    
    if (postcode) {
      // Match postcode prefix (first 2-4 characters for area matching)
      const postcodePrefix = postcode.substring(0, Math.min(4, postcode.length));
      filters.push(
        or(
          ilike(instructors.businessPostcode, `${postcodePrefix}%`),
          ilike(instructors.baseCity, `%${postcode}%`)
        )
      );
    }

    if (transmission) {
      if (transmission === 'manual') {
        filters.push(like(instructors.transmissionTypes, '%"manual"%'));
      } else if (transmission === 'automatic') {
        filters.push(like(instructors.transmissionTypes, '%"automatic"%'));
      }
    }

    if (ethnicity && ethnicity !== 'all') {
      filters.push(ilike(instructors.ethnicity, `%${ethnicity}%`));
    }

    if (religion && religion !== 'all') {
      filters.push(ilike(instructors.religion, `%${religion}%`));
    }

    if (teachingExpertise && teachingExpertise !== 'all') {
      filters.push(ilike(instructors.teachingExpertise, `%${teachingExpertise}%`));
    }

    if (experience && experience !== 'all') {
      const expValue = parseInt(experience);
      if (!isNaN(expValue)) {
        if (expValue === 5) {
          filters.push(gte(instructors.yearsExperience, 5));
        } else if (expValue === 10) {
          filters.push(gte(instructors.yearsExperience, 10));
        } else if (expValue === 15) {
          filters.push(gte(instructors.yearsExperience, 15));
        }
      }
    }

    if (priceRange && priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        filters.push(gte(instructors.hourlyRate, min.toString()));
        filters.push(lte(instructors.hourlyRate, max.toString()));
      }
    }

    if (carFuelType && carFuelType !== 'all') {
      const validFuelTypes = ['petrol', 'diesel', 'hybrid', 'electric'] as const;
      if (validFuelTypes.includes(carFuelType as any)) {
        filters.push(eq(instructors.carFuelType, carFuelType as any));
      }
    }

    // Execute query with all filters
    const instructorsData = await db
      .select({
        id: instructors.id,
        name: users.firstName,
        lastName: users.lastName,
        avatar: users.profilePicture,
        email: users.email,
        phone: users.phone,
        location: instructors.baseCity,
        postcode: instructors.businessPostcode,
        experience: instructors.yearsExperience,
        specialties: instructors.specialties,
        transmissionTypes: instructors.transmissionTypes,
        pricePerHour: instructors.hourlyRate,
        availability: instructors.availability,
        bio: instructors.bio,
        ethnicity: instructors.ethnicity,
        religion: instructors.religion,
        carMake: instructors.carMake,
        carModel: instructors.carModel,
        carYear: instructors.carYear,
        carType: instructors.carType,
        carFuelType: instructors.carFuelType,
        adiBadgeNumber: instructors.adiBadgeNumber,
        adiGrade: instructors.adiGrade,
        whatsappNumber: instructors.whatsappNumber,
        teachingExpertise: instructors.teachingExpertise,
        qualifications: instructors.qualifications,
        weeklyAvailability: instructors.weeklyAvailability,
        createdAt: instructors.createdAt,
        updatedAt: instructors.updatedAt,
      })
      .from(instructors)
      .innerJoin(users, eq(instructors.userId, users.id))
      .where(and(...filters))
      .limit(parseInt(limit));

    // Transform the data to match the expected format
    const transformedInstructors = instructorsData.map((instructor: any) => ({
      id: instructor.id.toString(),
      name: `${instructor.name} ${instructor.lastName || ''}`.trim(),
      avatar: instructor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=3B82F6&color=fff&size=100`,
      location: instructor.location,
      postcode: instructor.postcode,
      experience: instructor.experience,
      specialties: Array.isArray(instructor.specialties) ? instructor.specialties : [],
      transmissionTypes: Array.isArray(instructor.transmissionTypes) ? instructor.transmissionTypes : ['manual'],
      pricePerHour: parseFloat(instructor.pricePerHour?.toString() || '35'),
      availability: instructor.availability || 'Contact for availability',
      bio: instructor.bio || 'Experienced driving instructor',
      languages: ['English'], // Default for now
      nationality: 'British', // Default for now
      religion: instructor.religion || 'Not specified',
      ethnicity: instructor.ethnicity || 'Not specified',
      gender: 'Not specified', // Field not available in current schema
      email: instructor.email,
      phone: instructor.phone,
      whatsappNumber: instructor.whatsappNumber,
      carDetails: instructor.carMake && instructor.carModel ? 
        `${instructor.carMake} ${instructor.carModel} (${instructor.carYear || 'N/A'})` : 
        'Vehicle details available',
      carFuelType: instructor.carFuelType,
      adiBadgeNumber: instructor.adiBadgeNumber,
      adiGrade: instructor.adiGrade,
      teachingExpertise: instructor.teachingExpertise,
      qualifications: instructor.qualifications,
      weeklyAvailability: instructor.weeklyAvailability,
    }));

    return Response.json({
      success: true,
      instructors: transformedInstructors,
      total: transformedInstructors.length
    });

  } catch (error) {
    console.error('Error fetching instructors:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch instructors',
        instructors: [],
        total: 0 
      },
      { status: 500 }
    );
  }
}