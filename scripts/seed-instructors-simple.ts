import { db } from '../lib/db/drizzle';
import { instructors, users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function seedInstructors() {
  console.log('🌱 Starting simple instructor seeding...');
  
  try {
    // Get existing users to use as instructors
    const existingUsers = await db.select().from(users).limit(10);
    console.log(`Found ${existingUsers.length} existing users`);
    
    if (existingUsers.length === 0) {
      console.log('❌ No users found. Please create some users first.');
      process.exit(1);
    }

    const instructorDetails = [
      {
        postcode: 'M1 1AA',
        transmission: 'Both',
        ethnicity: 'White British',
        religion: 'Christian',
        teachingExpertise: 'New Drivers',
        experience: '5-10 years',
        carFuelType: 'Petrol',
        hourlyRate: 35.00
      },
      {
        postcode: 'B1 1BB',
        transmission: 'Manual',
        ethnicity: 'Arab',
        religion: 'Islam',
        teachingExpertise: 'Anxious Drivers',
        experience: '10+ years',
        carFuelType: 'Diesel',
        hourlyRate: 40.00
      },
      {
        postcode: 'SW1A 1AA',
        transmission: 'Automatic',
        ethnicity: 'Indian',
        religion: 'Hindu',
        teachingExpertise: 'Senior Drivers',
        experience: '3-5 years',
        carFuelType: 'Hybrid',
        hourlyRate: 32.00
      },
      {
        postcode: 'EH1 1EH',
        transmission: 'Both',
        ethnicity: 'White Scottish',
        religion: 'None',
        teachingExpertise: 'Intensive Courses',
        experience: '10+ years',
        carFuelType: 'Electric',
        hourlyRate: 45.00
      },
      {
        postcode: 'CF10 1CF',
        transmission: 'Manual',
        ethnicity: 'Hispanic',
        religion: 'Catholic',
        teachingExpertise: 'Pass Plus',
        experience: '5-10 years',
        carFuelType: 'Petrol',
        hourlyRate: 38.00
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
          console.log(`⚠️  User ${user.fullName || user.email} is already an instructor, skipping...`);
          continue;
        }
        
        await db.insert(instructors).values({
          userId: user.id,
          fullName: user.fullName || `Instructor ${i + 1}`,
          email: user.email,
          phone: `+44 7700 90000${i + 1}`,
          postcode: details.postcode,
          transmission: details.transmission,
          ethnicity: details.ethnicity,
          religion: details.religion,
          teachingExpertise: details.teachingExpertise,
          experience: details.experience,
          carFuelType: details.carFuelType,
          hourlyRate: details.hourlyRate,
          isActive: true,
          rating: 4.5 + (Math.random() * 0.5),
          totalLessons: Math.floor(Math.random() * 500) + 100,
          bio: `Experienced driving instructor specializing in ${details.teachingExpertise}. ${details.experience} of professional teaching experience.`,
          adiBadgeNumber: `ADI${String(100000 + i).substring(1)}`,
          adiGrade: Math.random() > 0.5 ? 'grade_4' : 'grade_5',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`✅ Added instructor: ${user.fullName || user.email}`);
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