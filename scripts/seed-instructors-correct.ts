import { db } from '../lib/db/drizzle';
import { instructors, users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function seedInstructors() {
  console.log('🌱 Starting instructor seeding with correct schema...');
  
  try {
    // Get existing users to convert to instructors
    const existingUsers = await db.select().from(users).limit(10);
    console.log(`Found ${existingUsers.length} existing users`);
    
    if (existingUsers.length === 0) {
      console.log('❌ No users found. Please create some users first.');
      process.exit(1);
    }

    const instructorDetails = [
      {
        adiBadgeNumber: 'ADI123456',
        adiGrade: 'grade_4' as const,
        yearsExperience: 8,
        hourlyRate: '35.00',
        specialties: ['New Drivers', 'Nervous Students'],
        instructorSummary: 'Experienced instructor specializing in building confidence',
        baseCity: 'Manchester',
        businessPostcode: 'M1 1AA',
        carMake: 'Toyota',
        carModel: 'Corolla',
        carYear: 2022,
        carType: 'manual' as const,
        carFuelType: 'petrol' as const,
        transmissionTypes: ['manual', 'automatic'],
        ethnicity: 'White British',
        religion: 'Christian',
        teachingExpertise: 'New Drivers'
      },
      {
        adiBadgeNumber: 'ADI234567',
        adiGrade: 'grade_5' as const,
        yearsExperience: 12,
        hourlyRate: '40.00',
        specialties: ['Anxious Drivers', 'Pass Plus'],
        instructorSummary: 'Patient instructor with focus on anxious students',
        baseCity: 'Birmingham',
        businessPostcode: 'B1 1BB',
        carMake: 'Ford',
        carModel: 'Focus',
        carYear: 2021,
        carType: 'manual' as const,
        carFuelType: 'diesel' as const,
        transmissionTypes: ['manual'],
        ethnicity: 'Arab',
        religion: 'Islam',
        teachingExpertise: 'Anxious Drivers'
      },
      {
        adiBadgeNumber: 'ADI345678',
        adiGrade: 'grade_4' as const,
        yearsExperience: 5,
        hourlyRate: '32.00',
        specialties: ['Senior Drivers', 'Refresher Lessons'],
        instructorSummary: 'Specialist in mature learner instruction',
        baseCity: 'London',
        businessPostcode: 'SW1A 1AA',
        carMake: 'Honda',
        carModel: 'Civic',
        carYear: 2020,
        carType: 'automatic' as const,
        carFuelType: 'hybrid' as const,
        transmissionTypes: ['automatic'],
        ethnicity: 'Indian',
        religion: 'Hindu',
        teachingExpertise: 'Senior Drivers'
      },
      {
        adiBadgeNumber: 'ADI456789',
        adiGrade: 'grade_6' as const,
        yearsExperience: 15,
        hourlyRate: '45.00',
        specialties: ['Intensive Courses', 'Test Preparation'],
        instructorSummary: 'Expert in intensive driving courses',
        baseCity: 'Edinburgh',
        businessPostcode: 'EH1 1EH',
        carMake: 'Tesla',
        carModel: 'Model 3',
        carYear: 2023,
        carType: 'automatic' as const,
        carFuelType: 'electric' as const,
        transmissionTypes: ['automatic'],
        ethnicity: 'White Scottish',
        religion: 'None',
        teachingExpertise: 'Intensive Courses'
      },
      {
        adiBadgeNumber: 'ADI567890',
        adiGrade: 'grade_5' as const,
        yearsExperience: 7,
        hourlyRate: '38.00',
        specialties: ['Pass Plus', 'Motorway Training'],
        instructorSummary: 'Advanced driving skills specialist',
        baseCity: 'Cardiff',
        businessPostcode: 'CF10 1CF',
        carMake: 'Volkswagen',
        carModel: 'Golf',
        carYear: 2021,
        carType: 'manual' as const,
        carFuelType: 'petrol' as const,
        transmissionTypes: ['manual', 'automatic'],
        ethnicity: 'Hispanic',
        religion: 'Catholic',
        teachingExpertise: 'Pass Plus'
      },
      {
        adiBadgeNumber: 'ADI678901',
        adiGrade: 'grade_4' as const,
        yearsExperience: 3,
        hourlyRate: '30.00',
        specialties: ['Theory Test Help', 'New Drivers'],
        instructorSummary: 'Theory test specialist and beginner-friendly',
        baseCity: 'Belfast',
        businessPostcode: 'BT1 1BT',
        carMake: 'Nissan',
        carModel: 'Micra',
        carYear: 2020,
        carType: 'automatic' as const,
        carFuelType: 'diesel' as const,
        transmissionTypes: ['automatic'],
        ethnicity: 'White Irish',
        religion: 'Catholic',
        teachingExpertise: 'Theory Test Help'
      },
      {
        adiBadgeNumber: 'ADI789012',
        adiGrade: 'grade_5' as const,
        yearsExperience: 6,
        hourlyRate: '35.00',
        specialties: ['Female Only', 'Nervous Students'],
        instructorSummary: 'Female instructor specializing in building confidence',
        baseCity: 'Leeds',
        businessPostcode: 'LS1 1LS',
        carMake: 'Toyota',
        carModel: 'Yaris',
        carYear: 2021,
        carType: 'automatic' as const,
        carFuelType: 'hybrid' as const,
        transmissionTypes: ['automatic'],
        ethnicity: 'Chinese',
        religion: 'Buddhist',
        teachingExpertise: 'Female Only'
      }
    ];
    
    console.log('📝 Converting users to instructors...');
    
    let added = 0;
    for (let i = 0; i < Math.min(existingUsers.length, instructorDetails.length); i++) {
      const user = existingUsers[i];
      const details = instructorDetails[i];
      
      try {
        // Check if user is already an instructor
        const existingInstructor = await db.select()
          .from(instructors)
          .where(eq(instructors.userId, user.id))
          .limit(1);
        
        if (existingInstructor.length > 0) {
          console.log(`⚠️  User ${user.firstName} ${user.lastName} is already an instructor, skipping...`);
          continue;
        }
        
        await db.insert(instructors).values({
          userId: user.id,
          adiBadgeNumber: details.adiBadgeNumber,
          adiGrade: details.adiGrade,
          yearsExperience: details.yearsExperience,
          hourlyRate: details.hourlyRate,
          specialties: details.specialties,
          instructorSummary: details.instructorSummary,
          baseCity: details.baseCity,
          businessPostcode: details.businessPostcode,
          carMake: details.carMake,
          carModel: details.carModel,
          carYear: details.carYear,
          carType: details.carType,
          carFuelType: details.carFuelType,
          transmissionTypes: details.transmissionTypes,
          ethnicity: details.ethnicity,
          religion: details.religion,
          teachingExpertise: details.teachingExpertise,
          isActive: true,
          isApproved: true,
          bio: `${details.instructorSummary}. ${details.yearsExperience} years of experience teaching driving.`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`✅ Added instructor: ${user.firstName} ${user.lastName}`);
        added++;
      } catch (insertError: any) {
        console.error(`❌ Error converting ${user.email}:`, insertError.message);
      }
    }
    
    console.log(`🎉 Successfully added ${added} instructors!`);
    
    // Show final count
    const totalInstructors = await db.select().from(instructors);
    console.log(`📊 Total instructors in database: ${totalInstructors.length}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding instructors:', error);
    process.exit(1);
  }
}

seedInstructors();