import { db } from '@/lib/db/drizzle';
import { users, instructors } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';

const additionalInstructors = [
  {
    // User data
    email: 'michael.johnson@example.com',
    firstName: 'Michael',
    lastName: 'Johnson',
    phone: '07123456789',
    city: 'London',
    // Instructor data
    adiBadgeNumber: 'ADI123456',
    adiGrade: 'grade_5' as const,
    yearsExperience: 12,
    hourlyRate: '42.00',
    specialties: ['Motorway Driving', 'Advanced Skills', 'Pass Plus'],
    baseCity: 'London',
    businessAddress: '123 High Street, London',
    businessPostcode: 'SW1A 1AA',
    whatsappNumber: '07123456789',
    ethnicity: 'Black British',
    religion: 'Christian',
    transmissionTypes: ['manual', 'automatic'],
    carMake: 'BMW',
    carModel: '3 Series',
    carYear: 2022,
    carType: 'manual' as const,
    carFuelType: 'petrol' as const,
    bio: 'Experienced instructor specializing in motorway driving and advanced techniques.',
    teachingExpertise: 'Advanced Driving'
  },
  {
    email: 'fatima.ali@example.com',
    firstName: 'Fatima',
    lastName: 'Ali',
    phone: '07234567890',
    city: 'Birmingham',
    adiBadgeNumber: 'ADI234567',
    adiGrade: 'grade_6' as const,
    yearsExperience: 7,
    hourlyRate: '36.00',
    specialties: ['Female Instructor', 'Nervous Drivers', 'Automatic Only'],
    baseCity: 'Birmingham',
    businessAddress: '456 Broad Street, Birmingham',
    businessPostcode: 'B1 2JP',
    whatsappNumber: '07234567890',
    ethnicity: 'South Asian',
    religion: 'Islam',
    transmissionTypes: ['automatic'],
    carMake: 'Toyota',
    carModel: 'Corolla',
    carYear: 2021,
    carType: 'automatic' as const,
    carFuelType: 'hybrid' as const,
    bio: 'Female instructor specializing in automatic lessons for nervous drivers.',
    teachingExpertise: 'Nervous Drivers'
  },
  {
    email: 'robert.davies@example.com',
    firstName: 'Robert',
    lastName: 'Davies',
    phone: '07345678901',
    city: 'Cardiff',
    adiBadgeNumber: 'ADI345678',
    adiGrade: 'grade_5' as const,
    yearsExperience: 15,
    hourlyRate: '34.00',
    specialties: ['Welsh Speaker', 'Theory Test Help', 'Mock Tests'],
    baseCity: 'Cardiff',
    businessAddress: '789 Queen Street, Cardiff',
    businessPostcode: 'CF10 3NQ',
    whatsappNumber: '07345678901',
    ethnicity: 'White Welsh',
    religion: 'Methodist',
    transmissionTypes: ['manual', 'automatic'],
    carMake: 'Ford',
    carModel: 'Focus',
    carYear: 2020,
    carType: 'manual' as const,
    carFuelType: 'petrol' as const,
    bio: 'Welsh-speaking instructor with extensive experience in theory test preparation.',
    teachingExpertise: 'Theory Support'
  },
  {
    email: 'priya.sharma@example.com',
    firstName: 'Priya',
    lastName: 'Sharma',
    phone: '07456789012',
    city: 'Leicester',
    adiBadgeNumber: 'ADI456789',
    adiGrade: 'grade_6' as const,
    yearsExperience: 9,
    hourlyRate: '38.00',
    specialties: ['Multi-lingual', 'Intensive Courses', 'Test Preparation'],
    baseCity: 'Leicester',
    businessAddress: '321 London Road, Leicester',
    businessPostcode: 'LE2 1RZ',
    whatsappNumber: '07456789012',
    ethnicity: 'South Asian',
    religion: 'Hindu',
    transmissionTypes: ['manual', 'automatic'],
    carMake: 'Nissan',
    carModel: 'Micra',
    carYear: 2023,
    carType: 'automatic' as const,
    carFuelType: 'petrol' as const,
    bio: 'Multi-lingual instructor offering intensive courses in Hindi, Gujarati, and English.',
    teachingExpertise: 'Intensive Courses'
  },
  {
    email: 'james.mcdonald@example.com',
    firstName: 'James',
    lastName: 'McDonald',
    phone: '07567890123',
    city: 'Glasgow',
    adiBadgeNumber: 'ADI567890',
    adiGrade: 'grade_5' as const,
    yearsExperience: 11,
    hourlyRate: '33.00',
    specialties: ['Scottish Driving', 'Weather Conditions', 'Rural Driving'],
    baseCity: 'Glasgow',
    businessAddress: '654 Sauchiehall Street, Glasgow',
    businessPostcode: 'G2 3LQ',
    whatsappNumber: '07567890123',
    ethnicity: 'White Scottish',
    religion: 'Presbyterian',
    transmissionTypes: ['manual'],
    carMake: 'Vauxhall',
    carModel: 'Corsa',
    carYear: 2021,
    carType: 'manual' as const,
    carFuelType: 'petrol' as const,
    bio: 'Scottish instructor specializing in challenging weather conditions and rural driving.',
    teachingExpertise: 'Weather Conditions'
  },
  {
    email: 'sophie.turner@example.com',
    firstName: 'Sophie',
    lastName: 'Turner',
    phone: '07678901234',
    city: 'Brighton',
    adiBadgeNumber: 'ADI678901',
    adiGrade: 'grade_6' as const,
    yearsExperience: 6,
    hourlyRate: '40.00',
    specialties: ['Young Drivers', 'University Students', 'Eco Driving'],
    baseCity: 'Brighton',
    businessAddress: '987 Western Road, Brighton',
    businessPostcode: 'BN3 1AE',
    whatsappNumber: '07678901234',
    ethnicity: 'White British',
    religion: 'None',
    transmissionTypes: ['automatic'],
    carMake: 'Tesla',
    carModel: 'Model 3',
    carYear: 2023,
    carType: 'automatic' as const,
    carFuelType: 'electric' as const,
    bio: 'Young, eco-conscious instructor specializing in electric vehicle training.',
    teachingExpertise: 'Eco Driving'
  },
  {
    email: 'ahmed.hassan@example.com',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    phone: '07789012345',
    city: 'Manchester',
    adiBadgeNumber: 'ADI789012',
    adiGrade: 'grade_5' as const,
    yearsExperience: 8,
    hourlyRate: '35.00',
    specialties: ['Arabic Speaker', 'Night Driving', 'City Centre'],
    baseCity: 'Manchester',
    businessAddress: '147 Curry Mile, Manchester',
    businessPostcode: 'M14 5LN',
    whatsappNumber: '07789012345',
    ethnicity: 'Middle Eastern',
    religion: 'Islam',
    transmissionTypes: ['manual', 'automatic'],
    carMake: 'Honda',
    carModel: 'Civic',
    carYear: 2022,
    carType: 'manual' as const,
    carFuelType: 'petrol' as const,
    bio: 'Arabic-speaking instructor with expertise in city centre and night driving.',
    teachingExpertise: 'City Driving'
  },
  {
    email: 'mary.oconnor@example.com',
    firstName: 'Mary',
    lastName: "O'Connor",
    phone: '07890123456',
    city: 'Belfast',
    adiBadgeNumber: 'ADI890123',
    adiGrade: 'grade_6' as const,
    yearsExperience: 13,
    hourlyRate: '32.00',
    specialties: ['Mature Learners', 'Refresher Courses', 'Anxiety Support'],
    baseCity: 'Belfast',
    businessAddress: '258 Lisburn Road, Belfast',
    businessPostcode: 'BT9 6GD',
    whatsappNumber: '07890123456',
    ethnicity: 'White Irish',
    religion: 'Catholic',
    transmissionTypes: ['manual', 'automatic'],
    carMake: 'Peugeot',
    carModel: '208',
    carYear: 2021,
    carType: 'automatic' as const,
    carFuelType: 'petrol' as const,
    bio: 'Patient instructor specializing in mature learners and refresher courses.',
    teachingExpertise: 'Mature Learners'
  },
  {
    email: 'david.chen@example.com',
    firstName: 'David',
    lastName: 'Chen',
    phone: '07901234567',
    city: 'Liverpool',
    adiBadgeNumber: 'ADI901234',
    adiGrade: 'grade_5' as const,
    yearsExperience: 10,
    hourlyRate: '37.00',
    specialties: ['Mandarin Speaker', 'International Students', 'Parallel Parking'],
    baseCity: 'Liverpool',
    businessAddress: '369 Bold Street, Liverpool',
    businessPostcode: 'L1 4DZ',
    whatsappNumber: '07901234567',
    ethnicity: 'Chinese British',
    religion: 'Buddhist',
    transmissionTypes: ['manual', 'automatic'],
    carMake: 'Hyundai',
    carModel: 'i30',
    carYear: 2022,
    carType: 'manual' as const,
    carFuelType: 'petrol' as const,
    bio: 'Mandarin-speaking instructor helping international students master UK driving.',
    teachingExpertise: 'International Students'
  },
  {
    email: 'elena.popovic@example.com',
    firstName: 'Elena',
    lastName: 'Popovic',
    phone: '07012345678',
    city: 'Nottingham',
    adiBadgeNumber: 'ADI012345',
    adiGrade: 'grade_6' as const,
    yearsExperience: 5,
    hourlyRate: '39.00',
    specialties: ['Eastern European Languages', 'New Immigrants', 'Crash Courses'],
    baseCity: 'Nottingham',
    businessAddress: '741 Mansfield Road, Nottingham',
    businessPostcode: 'NG5 2FW',
    whatsappNumber: '07012345678',
    ethnicity: 'Eastern European',
    religion: 'Orthodox',
    transmissionTypes: ['automatic'],
    carMake: 'Skoda',
    carModel: 'Fabia',
    carYear: 2023,
    carType: 'automatic' as const,
    carFuelType: 'petrol' as const,
    bio: 'Multi-lingual instructor specializing in helping new immigrants get their UK license.',
    teachingExpertise: 'New Immigrants'
  }
];

async function seedMoreInstructors() {
  try {
    console.log('🌱 Starting to seed 10 more instructors...');

    for (const instructor of additionalInstructors) {
      try {
        // Check if user already exists
        const existingUser = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, instructor.email))
          .limit(1);

        if (existingUser.length > 0) {
          console.log(`⚠️  User ${instructor.email} already exists, skipping...`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('instructor123', 10);

        // Create user
        const [newUser] = await db.insert(users).values({
          email: instructor.email,
          passwordHash: hashedPassword,
          firstName: instructor.firstName,
          lastName: instructor.lastName,
          phone: instructor.phone,
          role: 'instructor',
          city: instructor.city,
          isEmailVerified: true,
          isPhoneVerified: true,
          isActive: true,
        }).returning({ id: users.id });

        // Create instructor profile
        await db.insert(instructors).values({
          userId: newUser.id,
          adiBadgeNumber: instructor.adiBadgeNumber,
          adiGrade: instructor.adiGrade,
          yearsExperience: instructor.yearsExperience,
          hourlyRate: instructor.hourlyRate,
          specialties: instructor.specialties,
          baseCity: instructor.baseCity,
          businessAddress: instructor.businessAddress,
          businessPostcode: instructor.businessPostcode,
          whatsappNumber: instructor.whatsappNumber,
          ethnicity: instructor.ethnicity,
          religion: instructor.religion,
          transmissionTypes: instructor.transmissionTypes,
          carMake: instructor.carMake,
          carModel: instructor.carModel,
          carYear: instructor.carYear,
          carType: instructor.carType,
          carFuelType: instructor.carFuelType,
          bio: instructor.bio,
          teachingExpertise: instructor.teachingExpertise,
          isActive: true,
          isApproved: true,
        });

        console.log(`✅ Created instructor: ${instructor.firstName} ${instructor.lastName} (${instructor.baseCity})`);
      } catch (error) {
        console.error(`❌ Error creating instructor ${instructor.firstName} ${instructor.lastName}:`, error);
      }
    }

    console.log('\n🎉 Instructor seeding completed!');
  } catch (error) {
    console.error('❌ Database error:', error);
  }
}

// Import required functions
import { eq } from 'drizzle-orm';

seedMoreInstructors();