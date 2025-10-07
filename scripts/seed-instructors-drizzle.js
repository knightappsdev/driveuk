require('dotenv').config();
const { db } = require('../lib/db/drizzle');
const { instructors } = require('../lib/db/schema');

// Simple instructor seeding script using existing database connection
async function seedInstructors() {
  console.log('🌱 Starting instructor seeding...');
  
  const instructorData = [
    {
      userId: 'instructor_001',
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
    },
    {
      userId: 'instructor_002',
      fullName: 'Ahmed Hassan',
      email: 'ahmed.hassan@driveuk.com',
      phone: '+44 7700 900002',
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
      userId: 'instructor_003',
      fullName: 'Priya Sharma',
      email: 'priya.sharma@driveuk.com',
      phone: '+44 7700 900003',
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
      userId: 'instructor_004',
      fullName: 'David Thompson',
      email: 'david.thompson@driveuk.com',
      phone: '+44 7700 900004',
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
      userId: 'instructor_005',
      fullName: 'Maria Rodriguez',
      email: 'maria.rodriguez@driveuk.com',
      phone: '+44 7700 900005',
      postcode: 'CF10 1CF',
      transmission: 'Manual',
      ethnicity: 'Hispanic',
      religion: 'Catholic',
      teachingExpertise: 'Pass Plus',
      experience: '5-10 years',
      carFuelType: 'Petrol',
      hourlyRate: 38.00
    },
    {
      userId: 'instructor_006',
      fullName: 'James Wilson',
      email: 'james.wilson@driveuk.com',
      phone: '+44 7700 900006',
      postcode: 'BT1 1BT',
      transmission: 'Automatic',
      ethnicity: 'White Irish',
      religion: 'Catholic',
      teachingExpertise: 'Theory Test Help',
      experience: '1-3 years',
      carFuelType: 'Diesel',
      hourlyRate: 30.00
    },
    {
      userId: 'instructor_007',
      fullName: 'Lisa Chen',
      email: 'lisa.chen@driveuk.com',
      phone: '+44 7700 900007',
      postcode: 'LS1 1LS',
      transmission: 'Both',
      ethnicity: 'Chinese',
      religion: 'Buddhist',
      teachingExpertise: 'New Drivers',
      experience: '3-5 years',
      carFuelType: 'Hybrid',
      hourlyRate: 35.00
    },
    {
      userId: 'instructor_008',
      fullName: 'Michael Brown',
      email: 'michael.brown@driveuk.com',
      phone: '+44 7700 900008',
      postcode: 'NE1 1NE',
      transmission: 'Manual',
      ethnicity: 'White British',
      religion: 'None',
      teachingExpertise: 'Refresher Lessons',
      experience: '10+ years',
      carFuelType: 'Petrol',
      hourlyRate: 42.00
    },
    {
      userId: 'instructor_009',
      fullName: 'Fatima Al-Zahra',
      email: 'fatima.alzahra@driveuk.com',
      phone: '+44 7700 900009',
      postcode: 'OX1 1OX',
      transmission: 'Automatic',
      ethnicity: 'Arab',
      religion: 'Islam',
      teachingExpertise: 'Female Only',
      experience: '5-10 years',
      carFuelType: 'Electric',
      hourlyRate: 40.00
    },
    {
      userId: 'instructor_010',
      fullName: 'Robert Taylor',
      email: 'robert.taylor@driveuk.com',
      phone: '+44 7700 900010',
      postcode: 'CB1 1CB',
      transmission: 'Both',
      ethnicity: 'White British',
      religion: 'Christian',
      teachingExpertise: 'Intensive Courses',
      experience: '10+ years',
      carFuelType: 'Diesel',
      hourlyRate: 48.00
    }
  ];

  try {
    console.log('📝 Inserting instructors using Drizzle ORM...');
    
    for (const instructor of instructorData) {
      try {
        const result = await db.insert(instructors).values({
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
        }).returning();
        
        console.log(`✅ Added instructor: ${instructor.fullName}`);
      } catch (insertError) {
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

// Run the seeding
seedInstructors();