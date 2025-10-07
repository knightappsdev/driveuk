import { db } from '../lib/db/drizzle';
import { users } from '../lib/db/schema';
import bcrypt from 'bcryptjs';

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
        role: 'admin' as const,
        city: 'London',
        dateOfBirth: '1985-01-01',
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
        role: 'instructor' as const,
        city: 'Manchester',
        dateOfBirth: '1988-06-15',
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
        role: 'student' as const,
        city: 'Birmingham',
        dateOfBirth: '2000-03-20',
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
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 12);
      
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
      
      if (existingUser.length > 0) {
        console.log(`❌ User ${user.email} already exists, skipping...`);
        continue;
      }

      // Insert user
      await db.insert(users).values({
        ...user,
        passwordHash: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✅ Created ${user.role} user: ${user.email}`);
    }

    console.log('🎉 Demo users seeded successfully!');
    console.log('\n📝 Demo Login Credentials:');
    console.log('👤 Admin: admin@driveuk.com / Admin123!');
    console.log('🏫 Instructor: instructor@driveuk.com / Instructor123!');
    console.log('🎓 Student: student@driveuk.com / Student123!');
    
  } catch (error) {
    console.error('❌ Error seeding demo users:', error);
    throw error;
  }
}

// Check if we need the eq import
import { eq } from 'drizzle-orm';

if (require.main === module) {
  seedDemoUsers()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDemoUsers };