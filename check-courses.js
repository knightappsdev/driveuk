const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv/config');

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function checkCourses() {
  try {
    console.log('🔍 Checking courses in database...');
    
    const result = await client`SELECT * FROM courses ORDER BY id`;
    console.log(`Found ${result.length} courses in database:`);
    
    if (result.length > 0) {
      result.forEach((course, index) => {
        console.log(`${index + 1}. ${course.title} - £${course.price} (${course.level}) - Active: ${course.is_active}`);
      });
    } else {
      console.log('No courses found in database');
      
      // Create some sample courses
      console.log('\n📚 Creating sample courses...');
      
      const sampleCourses = [
        {
          title: 'Beginner Driving Course',
          description: 'Perfect for absolute beginners. Learn the basics of driving with our experienced instructors.',
          level: 'beginner',
          duration: 1200, // 20 hours in minutes
          price: '299.99',
          max_students: 1,
          enrolled_students: 0,
          transmission_type: 'manual',
          is_active: true,
          is_recommended: true
        },
        {
          title: 'Intensive Driving Course',
          description: 'Fast-track your driving skills with our intensive course. Ideal for quick learners.',  
          level: 'intermediate',
          duration: 1800, // 30 hours in minutes
          price: '499.99',
          max_students: 1,
          enrolled_students: 0,
          transmission_type: 'manual',
          is_active: true,
          is_recommended: false
        },
        {
          title: 'Pass Plus Course',
          description: 'Advanced driving course for newly qualified drivers. Improve your skills and confidence.',
          level: 'advanced',
          duration: 600, // 10 hours in minutes
          price: '199.99',
          max_students: 1,
          enrolled_students: 0,
          transmission_type: 'manual',
          is_active: true,
          is_recommended: false
        }
      ];
      
      for (const course of sampleCourses) {
        try {
          await client`
            INSERT INTO courses (title, description, level, duration, price, max_students, enrolled_students, transmission_type, is_active, is_recommended)
            VALUES (${course.title}, ${course.description}, ${course.level}, ${course.duration}, ${course.price}, ${course.max_students}, ${course.enrolled_students}, ${course.transmission_type}, ${course.is_active}, ${course.is_recommended})
          `;
          console.log(`✅ Created: ${course.title}`);
        } catch (error) {
          console.log(`❌ Failed to create ${course.title}:`, error.message);
        }
      }
      
      // Check again
      const newResult = await client`SELECT * FROM courses ORDER BY id`;
      console.log(`\n🎉 Now have ${newResult.length} courses in database!`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkCourses();