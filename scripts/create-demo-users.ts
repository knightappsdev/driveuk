import { db } from '../lib/db/drizzle';
import { users } from '../lib/db/schema';
import bcrypt from 'bcryptjs';

async function createDemoUsers() {
  try {
    console.log('🚀 Creating demo users...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const instructorPassword = await bcrypt.hash('Instructor123!', 12);
    const studentPassword = await bcrypt.hash('Student123!', 12);

    // Create demo users
    const demoUsers = [
      {
        email: 'admin@driveuk.com',
        passwordHash: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+44 7700 900123',
        dateOfBirth: new Date('1985-01-01'),
        role: 'admin' as const,
        isEmailVerified: true,
        isActive: true,
      },
      {
        email: 'instructor@driveuk.com',
        passwordHash: instructorPassword,
        firstName: 'John',
        lastName: 'Smith',
        phone: '+44 7700 900456',
        dateOfBirth: new Date('1980-05-15'),
        role: 'instructor' as const,
        isEmailVerified: true,
        isActive: true,
        bio: 'Experienced driving instructor with 10+ years of teaching experience.',
        teachingExpertise: 'Manual and Automatic transmission, Nervous drivers, Pass Plus courses',
        adiNumber: 'ADI123456',
      },
      {
        email: 'student@driveuk.com',
        passwordHash: studentPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '+44 7700 900789',
        dateOfBirth: new Date('1995-08-20'),
        role: 'student' as const,
        isEmailVerified: true,
        isActive: true,
      },
    ];

    // Insert users
    await db.insert(users).values(demoUsers);

    console.log('✅ Demo users created successfully!');
    console.log('Demo credentials:');
    console.log('Admin: admin@driveuk.com / Admin123!');
    console.log('Instructor: instructor@driveuk.com / Instructor123!');
    console.log('Student: student@driveuk.com / Student123!');

  } catch (error: any) {
    if (error.code === '23505') {
      console.log('⚠️  Demo users already exist in database');
    } else {
      console.error('❌ Error creating demo users:', error);
    }
  }
}

createDemoUsers().then(() => {
  console.log('🏁 Demo user creation completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});