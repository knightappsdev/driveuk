const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'driveuk_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
});

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
    adiGrade: 'grade_5',
    yearsExperience: 12,
    hourlyRate: 42.00,
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
    carType: 'manual',
    carFuelType: 'petrol',
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
    adiGrade: 'grade_6',
    yearsExperience: 7,
    hourlyRate: 36.00,
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
    carType: 'automatic',
    carFuelType: 'hybrid',
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
    adiGrade: 'grade_5',
    yearsExperience: 15,
    hourlyRate: 34.00,
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
    carType: 'manual',
    carFuelType: 'petrol',
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
    adiGrade: 'grade_6',
    yearsExperience: 9,
    hourlyRate: 38.00,
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
    carType: 'automatic',
    carFuelType: 'petrol',
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
    adiGrade: 'grade_5',
    yearsExperience: 11,
    hourlyRate: 33.00,
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
    carType: 'manual',
    carFuelType: 'petrol',
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
    adiGrade: 'grade_6',
    yearsExperience: 6,
    hourlyRate: 40.00,
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
    carType: 'automatic',
    carFuelType: 'electric',
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
    adiGrade: 'grade_5',
    yearsExperience: 8,
    hourlyRate: 35.00,
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
    carType: 'manual',
    carFuelType: 'petrol',
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
    adiGrade: 'grade_6',
    yearsExperience: 13,
    hourlyRate: 32.00,
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
    carType: 'automatic',
    carFuelType: 'petrol',
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
    adiGrade: 'grade_5',
    yearsExperience: 10,
    hourlyRate: 37.00,
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
    carType: 'manual',
    carFuelType: 'petrol',
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
    adiGrade: 'grade_6',
    yearsExperience: 5,
    hourlyRate: 39.00,
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
    carType: 'automatic',
    carFuelType: 'petrol',
    bio: 'Multi-lingual instructor specializing in helping new immigrants get their UK license.',
    teachingExpertise: 'New Immigrants'
  }
];

async function seedMoreInstructors() {
  try {
    await client.connect();
    console.log('🔌 Connected to database');

    for (const instructor of additionalInstructors) {
      try {
        // Check if user already exists
        const existingUser = await client.query(
          'SELECT id FROM users WHERE email = $1',
          [instructor.email]
        );

        if (existingUser.rows.length > 0) {
          console.log(`⚠️  User ${instructor.email} already exists, skipping...`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('instructor123', 10);

        // Create user
        const userResult = await client.query(`
          INSERT INTO users (
            email, password_hash, first_name, last_name, phone, role, city,
            is_email_verified, is_phone_verified, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING id
        `, [
          instructor.email,
          hashedPassword,
          instructor.firstName,
          instructor.lastName,
          instructor.phone,
          'instructor',
          instructor.city,
          true,
          true,
          true
        ]);

        const userId = userResult.rows[0].id;

        // Create instructor profile
        await client.query(`
          INSERT INTO instructors (
            user_id, adi_badge_number, adi_grade, years_experience, hourly_rate,
            specialties, base_city, business_address, business_postcode,
            whatsapp_number, ethnicity, religion, transmission_types,
            car_make, car_model, car_year, car_type, car_fuel_type,
            bio, teaching_expertise, is_active, is_approved
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        `, [
          userId,
          instructor.adiBadgeNumber,
          instructor.adiGrade,
          instructor.yearsExperience,
          instructor.hourlyRate,
          JSON.stringify(instructor.specialties),
          instructor.baseCity,
          instructor.businessAddress,
          instructor.businessPostcode,
          instructor.whatsappNumber,
          instructor.ethnicity,
          instructor.religion,
          JSON.stringify(instructor.transmissionTypes),
          instructor.carMake,
          instructor.carModel,
          instructor.carYear,
          instructor.carType,
          instructor.carFuelType,
          instructor.bio,
          instructor.teachingExpertise,
          true,
          true
        ]);

        console.log(`✅ Created instructor: ${instructor.firstName} ${instructor.lastName} (${instructor.baseCity})`);
      } catch (error) {
        console.error(`❌ Error creating instructor ${instructor.firstName} ${instructor.lastName}:`, error.message);
      }
    }

    console.log('\n🎉 Instructor seeding completed!');
  } catch (error) {
    console.error('❌ Database connection error:', error);
  } finally {
    await client.end();
  }
}

seedMoreInstructors();