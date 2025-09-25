import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './schema';

const connection = postgres(process.env.DATABASE_URL!);
const db = drizzle(connection);

const instructors = [
  {
    name: 'David Thompson',
    email: 'david.thompson@driveschoolpro.com',
    passwordHash: '$2b$10$K7L/8Y0YtJbHfxZfA8wQ8uW9Y9X9X9X9X9X9X9X9X9X9X9X9X9X9X', // bcrypt hash for 'password123'
    role: 'instructor' as const,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@driveschoolpro.com',
    passwordHash: '$2b$10$K7L/8Y0YtJbHfxZfA8wQ8uW9Y9X9X9X9X9X9X9X9X9X9X9X9X9X9X', // bcrypt hash for 'password123'
    role: 'instructor' as const,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
];

async function seedInstructors() {
  try {
    console.log('Seeding instructors...');
    
    for (const instructor of instructors) {
      await db.insert(users).values(instructor).execute();
      console.log(`✅ Seeded instructor: ${instructor.name}`);
    }
    
    console.log('Instructors seeded successfully!');
  } catch (error) {
    console.error('Error seeding instructors:', error);
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  seedInstructors();
}

export { seedInstructors };