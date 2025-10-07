require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

// Simple instructor seeding script
async function seedInstructors() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🌱 Starting instructor seeding...');
  
  const sql = neon(databaseUrl);

  const instructors = [
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
      hourlyRate: 35
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
      hourlyRate: 40
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
      hourlyRate: 32
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
      hourlyRate: 45
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
      hourlyRate: 38
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
      hourlyRate: 30
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
      hourlyRate: 35
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
      hourlyRate: 42
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
      hourlyRate: 40
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
      hourlyRate: 48
    }
  ];

  try {
    console.log('📝 Inserting instructors...');
    
    for (const instructor of instructors) {
      // Insert into instructors table
      await sql`
        INSERT INTO instructors (
          user_id, full_name, email, phone, postcode, transmission, 
          ethnicity, religion, teaching_expertise, experience, 
          car_fuel_type, hourly_rate, is_active, created_at, updated_at
        ) VALUES (
          ${instructor.userId}, ${instructor.fullName}, ${instructor.email}, 
          ${instructor.phone}, ${instructor.postcode}, ${instructor.transmission},
          ${instructor.ethnicity}, ${instructor.religion}, ${instructor.teachingExpertise},
          ${instructor.experience}, ${instructor.carFuelType}, ${instructor.hourlyRate},
          true, NOW(), NOW()
        )
        ON CONFLICT (user_id) DO NOTHING
      `;
      
      console.log(`✅ Added instructor: ${instructor.fullName}`);
    }
    
    console.log('🎉 Instructor seeding completed successfully!');
    
    // Show count
    const result = await sql`SELECT COUNT(*) as count FROM instructors`;
    console.log(`📊 Total instructors in database: ${result[0].count}`);
    
  } catch (error) {
    console.error('❌ Error seeding instructors:', error);
    process.exit(1);
  }
}

// Run the seeding
seedInstructors();