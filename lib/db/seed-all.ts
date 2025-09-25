import seedCourses from './seed-courses';
import { seedStudents } from './seed-students';
import { seedInstructors } from './seed-instructors';
import seedPurchases from './seed-purchases';

async function seedAll() {
  try {
    console.log('Starting complete database seeding...');
    
    // Seed in order to respect foreign key constraints
    await seedCourses();
    await seedStudents();
    await seedInstructors();
    await seedPurchases();
    
    console.log('All data seeded successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

if (require.main === module) {
  seedAll();
}

export { seedAll };