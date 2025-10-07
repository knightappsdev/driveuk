import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    const demoUsers = [
      {
        email: 'admin@driveuk.com',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'User',
        phone: '07700000001',
        role: 'admin' as const,
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
        role: 'instructor' as const,
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
        role: 'student' as const,
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

    const results = [];

    for (const user of demoUsers) {
      try {
        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
        
        if (existingUser.length > 0) {
          results.push({ email: user.email, status: 'exists', message: 'User already exists' });
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 12);
        
        // Insert user
        await db.insert(users).values({
          ...user,
          passwordHash: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        results.push({ email: user.email, status: 'created', message: 'User created successfully' });
      } catch (userError) {
        console.error(`Error creating user ${user.email}:`, userError);
        results.push({ email: user.email, status: 'error', message: userError instanceof Error ? userError.message : 'Unknown error' });
      }
    }

    return NextResponse.json({
      message: 'Demo users creation completed',
      results,
      credentials: {
        admin: { email: 'admin@driveuk.com', password: 'Admin123!' },
        instructor: { email: 'instructor@driveuk.com', password: 'Instructor123!' },
        student: { email: 'student@driveuk.com', password: 'Student123!' },
      }
    });

  } catch (error) {
    console.error('Demo users creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create demo users', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}