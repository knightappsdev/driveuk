import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './schema';

const connection = postgres(process.env.DATABASE_URL!);
const db = drizzle(connection);

const students = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    passwordHash: '$2b$10$K7L/8Y0YtJbHfxZfA8wQ8uW9Y9X9X9X9X9X9X9X9X9X9X9X9X9X9X', // bcrypt hash for 'password123'
    role: 'student' as const,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    passwordHash: '$2b$10$K7L/8Y0YtJbHfxZfA8wQ8uW9Y9X9X9X9X9X9X9X9X9X9X9X9X9X9X', // bcrypt hash for 'password123'
    role: 'student' as const,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

async function seedStudents() {
  try {
    console.log('Seeding students...');
    
    for (const student of students) {
      await db.insert(users).values(student).execute();
      console.log(`✅ Seeded student: ${student.name}`);
    }
    
    console.log('Students seeded successfully!');
  } catch (error) {
    console.error('Error seeding students:', error);
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  seedStudents();
}

export { seedStudents };