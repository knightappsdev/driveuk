import dotenv from 'dotenv';
dotenv.config();

import { db } from '../lib/db/drizzle';
import { courses } from '../lib/db/schema';

const newCourses = [
  {
    title: 'Intensive Crash Course',
    description: 'Complete your driving lessons in just 1-2 weeks with our intensive program. Perfect for fast learners who want to get on the road quickly.',
    level: 'intermediate',
    duration: 120,
    price: '899.00',
    maxStudents: 1,
    transmissionType: 'manual' as const,
    isRecommended: true
  },
  {
    title: 'Pass Plus Course',
    description: 'Advanced driving course for newly qualified drivers. Improve your skills in different driving conditions and potentially reduce insurance costs.',
    level: 'advanced',
    duration: 90,
    price: '299.00',
    maxStudents: 1,
    transmissionType: 'both' as const,
    isRecommended: false
  },
  {
    title: 'Refresher Course',
    description: 'Perfect for drivers who haven\'t driven for a while or want to boost their confidence. Tailored lessons to get you back on the road safely.',
    level: 'intermediate',
    duration: 60,
    price: '199.00',
    maxStudents: 1,
    transmissionType: 'both' as const,
    isRecommended: false
  },
  {
    title: 'Mock Test Preparation',
    description: 'Practice your driving test with our experienced instructors. Includes test route familiarization and detailed feedback on your performance.',
    level: 'advanced',
    duration: 75,
    price: '79.00',
    maxStudents: 1,
    transmissionType: 'manual' as const,
    isRecommended: true
  }
];

async function seedCourses() {
  try {
    console.log('Starting to seed courses...');
    
    for (const course of newCourses) {
      try {
        const result = await db.insert(courses).values(course).returning();
        console.log(`✅ Created course: ${result[0].title} (ID: ${result[0].id})`);
      } catch (error: any) {
        if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
          console.log(`⚠️  Course already exists: ${course.title}`);
        } else {
          console.error(`❌ Error creating course ${course.title}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Course seeding completed!');
    
    // Verify by fetching all courses
    const allCourses = await db.select().from(courses);
    console.log('\nCurrent courses in database:');
    allCourses.forEach(course => {
      console.log(`- ${course.title} (£${course.price}) - ${course.level}`);
    });
    
  } catch (error) {
    console.error('Error seeding courses:', error);
  } finally {
    process.exit(0);
  }
}

seedCourses();