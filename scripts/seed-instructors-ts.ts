import { db } from '../lib/db/drizzle';
import { instructors, users } from '../lib/db/schema';
import bcrypt from 'bcryptjs';

const instructorData = [
  {
    username: 'sarah.mitchell',
    fullName: 'Sarah Mitchell',
    email: 'sarah.mitchell@driveuk.com',
    phone: '+44 7700 900001',
    postcode: 'M1 1AA',
    transmission: 'Both',
    ethnicity: 'White British',
    religion: 'Christian',
    teachingExpertise: 'New Drivers',
    experience: '5-10 years',
    carFuelType: 'Petrol',
    hourlyRate: 35.00
  }
  // Add more instructors as needed, but let's start with a simple approach
  // For now, I'll create a simpler version that uses existing user IDs
];

async function seedInstructors() {
  console.log('🌱 Starting instructor seeding...');
  
  try {
    console.log('📝 Inserting instructors...');
    
    for (const instructor of instructorData) {
      try {
        await db.insert(instructors).values({
          userId: instructor.userId,
          fullName: instructor.fullName,
          email: instructor.email,
          phone: instructor.phone,
          postcode: instructor.postcode,
          transmission: instructor.transmission,
          ethnicity: instructor.ethnicity,
          religion: instructor.religion,
          teachingExpertise: instructor.teachingExpertise,
          experience: instructor.experience,
          carFuelType: instructor.carFuelType,
          hourlyRate: instructor.hourlyRate,
          isActive: true,
          rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5-5.0
          totalLessons: Math.floor(Math.random() * 500) + 100, // Random lessons 100-600
          bio: `Experienced driving instructor specializing in ${instructor.teachingExpertise}. ${instructor.experience} of professional teaching experience.`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`✅ Added instructor: ${instructor.fullName}`);
      } catch (insertError: any) {
        if (insertError.message.includes('duplicate key') || insertError.message.includes('unique constraint')) {
          console.log(`⚠️  Instructor ${instructor.fullName} already exists, skipping...`);
        } else {
          console.error(`❌ Error inserting ${instructor.fullName}:`, insertError.message);
        }
      }
    }
    
    console.log('🎉 Instructor seeding completed!');
    
    // Show final count
    const count = await db.select().from(instructors);
    console.log(`📊 Total instructors in database: ${count.length}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding instructors:', error);
    process.exit(1);
  }
}

seedInstructors();