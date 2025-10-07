const instructors = [
  {
    email: 'michael.johnson@example.com',
    firstName: 'Michael',
    lastName: 'Johnson',
    phone: '07123456789',
    city: 'London',
    adiBadgeNumber: 'ADI123456',
    adiGrade: 'grade_5',
    yearsExperience: 12,
    hourlyRate: 42.00,
    specialties: ['Motorway Driving', 'Advanced Skills', 'Pass Plus'],
    baseCity: 'London',
    businessAddress: '123 High Street, London',
    businessPostcode: 'SW1A 1AA',
    whatsappNumber: '07123456789'
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
    whatsappNumber: '07234567890'
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
    whatsappNumber: '07345678901'
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
    whatsappNumber: '07456789012'
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
    whatsappNumber: '07567890123'
  },
];

async function createInstructors() {
  console.log('🌱 Creating instructors via API...');
  
  for (const instructor of instructors) {
    try {
      const response = await fetch('http://localhost:3000/api/admin/instructors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(instructor)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ Created: ${instructor.firstName} ${instructor.lastName} (${instructor.baseCity})`);
      } else {
        console.log(`⚠️  ${instructor.firstName} ${instructor.lastName}: ${result.error || 'Failed to create'}`);
      }
    } catch (error) {
      console.error(`❌ Error creating ${instructor.firstName} ${instructor.lastName}:`, error.message);
    }
  }
  
  console.log('🎉 Instructor creation completed!');
}

createInstructors();