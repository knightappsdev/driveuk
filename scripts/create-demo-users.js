const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const bcrypt = require('bcryptjs');

// Define schema inline to avoid import issues
const { pgTable, serial, varchar, text, timestamp, boolean, date, pgEnum } = require('drizzle-orm/pg-core');

const userRoleEnum = pgEnum('user_role', ['student', 'instructor', 'admin']);

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  role: userRoleEnum('role').notNull(),
  city: varchar('city', { length: 100 }),
  isEmailVerified: boolean('is_email_verified').default(false),
  isPhoneVerified: boolean('is_phone_verified').default(false),
  isActive: boolean('is_active').default(true),
  isBlocked: boolean('is_blocked').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

require('dotenv').config({ path: '.env.local' });

async function createDemoUsers() {
  try {
    console.log('🚀 Creating demo users...');

    const client = postgres(process.env.DATABASE_URL, {
      max: 1,
    });
    
    const db = drizzle(client, { schema: { users } });

    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const instructorPassword = await bcrypt.hash('Instructor123!', 12);
    const studentPassword = await bcrypt.hash('Student123!', 12);

    // Create demo users (basic user records only)
    const demoUsers = [
      {
        email: 'admin@driveuk.com',
        passwordHash: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+44 7700 900123',
        role: 'admin',
        isEmailVerified: true,
        isActive: true,
      },
      {
        email: 'instructor@driveuk.com',
        passwordHash: instructorPassword,
        firstName: 'John',
        lastName: 'Smith',
        phone: '+44 7700 900456',
        role: 'instructor',
        isEmailVerified: true,
        isActive: true,
      },
      {
        email: 'student@driveuk.com',
        passwordHash: studentPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '+44 7700 900789',
        role: 'student',
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

    await client.end();

  } catch (error) {
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