const path = require('path');
const { createRequire } = require('module');

// Set up the require to work from the project root
process.chdir(path.join(__dirname, '..'));

const { db } = require('./lib/db/drizzle');
const { users } = require('./lib/db/schema');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcryptjs');

async function seedDemoUsers() {
  try {
    console.log('🌱 Seeding demo users...');

    const demoUsers = [
      {
        email: 'admin@driveuk.com',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'User',
        phone: '07700000001',
        role: 'admin',
        city: 'London',
        dateOfBirth: new Date('1985-01-01'),
        address: '1 Admin Street, London',
        postcode: 'SW1A 1AA',
        isEmailVerified: true,
      },
      {
        email: 'instructor@driveuk.com',
        password: 'Instructor123!',
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '07700000002',
        role: 'instructor',
        city: 'Manchester',
        dateOfBirth: new Date('1988-06-15'),
        address: '2 Instructor Avenue, Manchester',
        postcode: 'M1 1AB',
        isEmailVerified: true,
        adiNumber: 'ADI123456',
        hourlyRate: 45,
        bio: 'Experienced driving instructor with over 8 years of teaching. Specializing in nervous drivers and pass plus courses.',
        teachingExpertise: 'Manual, Automatic, Pass Plus, Refresher Courses',
      },
      {
        email: 'student@driveuk.com',
        password: 'Student123!',
        firstName: 'John',
        lastName: 'Smith',
        phone: '07700000003',
        role: 'student',
        city: 'Birmingham',
        dateOfBirth: new Date('2000-03-20'),
        address: '3 Student Road, Birmingham',
        postcode: 'B1 1AA',
        isEmailVerified: true,
        licenseNumber: 'SMITH123456AB7CD',
        learningGoals: 'Pass my driving test within 6 months',
        previousDrivingExperience: 'None',
        emergencyContactName: 'Jane Smith',
        emergencyContactPhone: '07987654321',
        emergencyContactRelationship: 'mother',
      },
    ];

    for (const user of demoUsers) {
      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 12);
        
        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
        
        if (existingUser.length > 0) {
          console.log(`❌ User ${user.email} already exists, skipping...`);
          continue;
        }

        // Insert user
        const insertData = {
          ...user,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        delete insertData.password; // Remove original password
        insertData.password = hashedPassword;

        await db.insert(users).values(insertData);

        console.log(`✅ Created ${user.role} user: ${user.email}`);
      } catch (userError) {
        console.error(`❌ Error creating user ${user.email}:`, userError);
      }
    }

    console.log('🎉 Demo users seeding completed!');
    console.log('\n📝 Demo Login Credentials:');
    console.log('👤 Admin: admin@driveuk.com / Admin123!');
    console.log('🏫 Instructor: instructor@driveuk.com / Instructor123!');
    console.log('🎓 Student: student@driveuk.com / Student123!');
    
  } catch (error) {
    console.error('❌ Error seeding demo users:', error);
    throw error;
  }
}

seedDemoUsers()
  .then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });