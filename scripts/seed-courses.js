// Seed 4 courses to the database
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const courses = [
  {
    title: 'Intensive Crash Course',
    description: 'Complete your driving lessons in just 1-2 weeks with our intensive program. Perfect for fast learners who want to get on the road quickly.',
    level: 'intermediate',
    duration: 120,
    price: '899.00',
    max_students: 1,
    transmission_type: 'manual',
    is_recommended: true
  },
  {
    title: 'Pass Plus Course',
    description: 'Advanced driving course for newly qualified drivers. Improve your skills in different driving conditions and potentially reduce insurance costs.',
    level: 'advanced',
    duration: 90,
    price: '299.00',
    max_students: 1,
    transmission_type: 'both',
    is_recommended: false
  },
  {
    title: 'Refresher Course',
    description: 'Perfect for drivers who haven\'t driven for a while or want to boost their confidence. Tailored lessons to get you back on the road safely.',
    level: 'intermediate',
    duration: 60,
    price: '199.00',
    max_students: 1,
    transmission_type: 'both',
    is_recommended: false
  },
  {
    title: 'Mock Test Preparation',
    description: 'Practice your driving test with our experienced instructors. Includes test route familiarization and detailed feedback on your performance.',
    level: 'advanced',
    duration: 75,
    price: '79.00',
    max_students: 1,
    transmission_type: 'manual',
    is_recommended: true
  }
];

async function seedCourses() {
  try {
    console.log('Starting to seed courses...');
    
    for (const course of courses) {
      const query = `
        INSERT INTO courses (title, description, level, duration, price, max_students, transmission_type, is_recommended, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (title) DO NOTHING
        RETURNING id, title;
      `;
      
      const values = [
        course.title,
        course.description,
        course.level,
        course.duration,
        course.price,
        course.max_students,
        course.transmission_type,
        course.is_recommended,
        true
      ];
      
      const result = await pool.query(query, values);
      
      if (result.rows.length > 0) {
        console.log(`✅ Created course: ${result.rows[0].title} (ID: ${result.rows[0].id})`);
      } else {
        console.log(`⚠️  Course already exists: ${course.title}`);
      }
    }
    
    console.log('\n🎉 Course seeding completed!');
    
    // Verify by fetching all courses
    const allCourses = await pool.query('SELECT id, title, price, level FROM courses WHERE is_active = true ORDER BY id DESC LIMIT 10');
    console.log('\nCurrent courses in database:');
    allCourses.rows.forEach(course => {
      console.log(`- ${course.title} (£${course.price}) - ${course.level}`);
    });
    
  } catch (error) {
    console.error('Error seeding courses:', error);
  } finally {
    await pool.end();
  }
}

seedCourses();