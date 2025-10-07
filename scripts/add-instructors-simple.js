// Simple instructor insertion script using direct database connection
// This avoids process hanging by using a straightforward approach

const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const db = drizzle(pool);

const instructorData = [
  {
    email: 'john.smith@driveuk.com',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+44 7123 456789',
    city: 'Manchester',
    postcode: 'M1 1AA',
    adiBadgeNumber: 'ADI12345',
    adiGrade: 'Grade A',
    yearsExperience: 8,
    hourlyRate: '35.00',
    baseCity: 'Manchester',
    carMake: 'Ford',
    carModel: 'Focus',
    carYear: 2020,
    carType: 'Manual',
    carFuelType: 'Petrol',
    vehicleRegistration: 'MN20 ABC',
    ethnicity: 'White British',
    religion: 'Christian',
    teachingExpertise: 'Nervous Learners',
    bio: 'Friendly and patient instructor with 8 years of experience. I specialize in helping nervous learners build confidence.',
    specialties: ['nervous_learners', 'pass_plus', 'intensive_courses'],
    transmissionTypes: ['Manual', 'Automatic']
  },
  {
    email: 'sarah.johnson@driveuk.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+44 7234 567890',
    city: 'Birmingham',
    postcode: 'B1 1AB',
    adiBadgeNumber: 'ADI23456',
    adiGrade: 'Grade A',
    yearsExperience: 6,
    hourlyRate: '32.00',
    baseCity: 'Birmingham',
    carMake: 'Toyota',
    carModel: 'Corolla',
    carYear: 2019,
    carType: 'Automatic',
    carFuelType: 'Hybrid',
    vehicleRegistration: 'BM19 DEF',
    ethnicity: 'Asian British',
    religion: 'Hindu',
    teachingExpertise: 'Automatic Specialist',
    bio: 'Calm and encouraging instructor who loves helping people regain their driving confidence.',
    specialties: ['automatic_only', 'elderly_learners', 'refresher_courses'],
    transmissionTypes: ['Automatic']
  },
  {
    email: 'david.williams@driveuk.com',
    firstName: 'David',
    lastName: 'Williams',
    phone: '+44 7345 678901',
    city: 'Leeds',
    postcode: 'LS1 1AC',
    adiBadgeNumber: 'ADI34567',
    adiGrade: 'Grade A',
    yearsExperience: 12,
    hourlyRate: '38.00',
    baseCity: 'Leeds',
    carMake: 'BMW',
    carModel: '1 Series',
    carYear: 2021,
    carType: 'Manual',
    carFuelType: 'Diesel',
    vehicleRegistration: 'LD21 GHI',
    ethnicity: 'White British',
    religion: 'Atheist',
    teachingExpertise: 'Advanced Driving',
    bio: 'Experienced instructor specializing in advanced driving techniques and motorway lessons.',
    specialties: ['advanced_driving', 'motorway_lessons', 'pass_plus'],
    transmissionTypes: ['Manual']
  },
  {
    email: 'emma.brown@driveuk.com',
    firstName: 'Emma',
    lastName: 'Brown',
    phone: '+44 7456 789012',
    city: 'Sheffield',
    postcode: 'S1 1AD',
    adiBadgeNumber: 'ADI45678',
    adiGrade: 'Grade B',
    yearsExperience: 4,
    hourlyRate: '30.00',
    baseCity: 'Sheffield',
    carMake: 'Vauxhall',
    carModel: 'Corsa',
    carYear: 2018,
    carType: 'Manual',
    carFuelType: 'Petrol',
    vehicleRegistration: 'SF18 JKL',
    ethnicity: 'Mixed Race',
    religion: 'Christian',
    teachingExpertise: 'Young Drivers',
    bio: 'Young and enthusiastic instructor who connects well with teenage learners.',
    specialties: ['young_drivers', 'theory_test_help', 'budget_lessons'],
    transmissionTypes: ['Manual']
  },
  {
    email: 'michael.davis@driveuk.com',
    firstName: 'Michael',
    lastName: 'Davis',
    phone: '+44 7567 890123',
    city: 'Bristol',
    postcode: 'BS1 1AE',
    adiBadgeNumber: 'ADI56789',
    adiGrade: 'Grade A',
    yearsExperience: 10,
    hourlyRate: '36.00',
    baseCity: 'Bristol',
    carMake: 'Volkswagen',
    carModel: 'Golf',
    carYear: 2020,
    carType: 'Manual',
    carFuelType: 'Petrol',
    vehicleRegistration: 'BS20 MNO',
    ethnicity: 'White British',
    religion: 'Christian',
    teachingExpertise: 'Intensive Courses',
    bio: 'Results-focused instructor with excellent first-time pass rates in intensive courses.',
    specialties: ['intensive_courses', 'test_preparation', 'city_driving'],
    transmissionTypes: ['Manual', 'Automatic']
  }
];

async function addInstructors() {
  try {
    console.log('🚀 Starting instructor insertion process...');
    
    for (const instructor of instructorData) {
      try {
        console.log(`\n📝 Processing: ${instructor.firstName} ${instructor.lastName}`);
        
        // Insert user first
        const userQuery = `
          INSERT INTO users (email, first_name, last_name, user_type, phone, city, postcode, is_verified, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
          ON CONFLICT (email) DO NOTHING
          RETURNING id;
        `;
        
        const userResult = await pool.query(userQuery, [
          instructor.email,
          instructor.firstName,
          instructor.lastName,
          'instructor',
          instructor.phone,
          instructor.city,
          instructor.postcode,
          true
        ]);
        
        let userId;
        if (userResult.rows.length > 0) {
          userId = userResult.rows[0].id;
          console.log(`✓ Created user with ID: ${userId}`);
        } else {
          // User already exists, get the ID
          const existingUserResult = await pool.query('SELECT id FROM users WHERE email = $1', [instructor.email]);
          userId = existingUserResult.rows[0].id;
          console.log(`ℹ User already exists with ID: ${userId}`);
        }
        
        // Insert instructor record
        const instructorQuery = `
          INSERT INTO instructors (
            user_id, adi_badge_number, adi_grade, years_experience, hourly_rate,
            specialties, base_city, business_postcode, whatsapp_number,
            car_make, car_model, car_year, car_type, car_fuel_type, vehicle_registration,
            transmission_types, ethnicity, religion, is_active, is_approved,
            bio, teaching_expertise, adi_number, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, NOW(), NOW()
          )
          ON CONFLICT (user_id) DO NOTHING;
        `;
        
        await pool.query(instructorQuery, [
          userId,
          instructor.adiBadgeNumber,
          instructor.adiGrade,
          instructor.yearsExperience,
          instructor.hourlyRate,
          JSON.stringify(instructor.specialties),
          instructor.baseCity,
          instructor.postcode,
          instructor.phone,
          instructor.carMake,
          instructor.carModel,
          instructor.carYear,
          instructor.carType,
          instructor.carFuelType,
          instructor.vehicleRegistration,
          JSON.stringify(instructor.transmissionTypes),
          instructor.ethnicity,
          instructor.religion,
          true,
          true,
          instructor.bio,
          instructor.teachingExpertise,
          instructor.adiBadgeNumber
        ]);
        
        console.log(`✅ Successfully added instructor: ${instructor.firstName} ${instructor.lastName}`);
        
      } catch (error) {
        console.error(`❌ Error adding ${instructor.firstName} ${instructor.lastName}:`, error.message);
      }
    }
    
    // Verify the results
    console.log('\n🔍 Verifying results...');
    const countQuery = 'SELECT COUNT(*) as total FROM instructors WHERE is_active = true';
    const countResult = await pool.query(countQuery);
    console.log(`📊 Total active instructors: ${countResult.rows[0].total}`);
    
    console.log('\n🎉 Instructor insertion process completed!');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

// Run the function
addInstructors();