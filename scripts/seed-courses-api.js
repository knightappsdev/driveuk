// Direct database seeding using API endpoint
const API_BASE = 'http://localhost:3000';

const newCourses = [
  {
    title: 'Intensive Crash Course',
    description: 'Complete your driving lessons in just 1-2 weeks with our intensive program. Perfect for fast learners who want to get on the road quickly.',
    level: 'intermediate',
    duration: 120,
    price: '899.00',
    maxStudents: 1,
    transmissionType: 'manual',
    isRecommended: true
  },
  {
    title: 'Pass Plus Course',
    description: 'Advanced driving course for newly qualified drivers. Improve your skills in different driving conditions and potentially reduce insurance costs.',
    level: 'advanced',
    duration: 90,
    price: '299.00',
    maxStudents: 1,
    transmissionType: 'both',
    isRecommended: false
  },
  {
    title: 'Refresher Course',
    description: 'Perfect for drivers who haven\'t driven for a while or want to boost their confidence. Tailored lessons to get you back on the road safely.',
    level: 'intermediate',
    duration: 60,
    price: '199.00',
    maxStudents: 1,
    transmissionType: 'both',
    isRecommended: false
  },
  {
    title: 'Mock Test Preparation',
    description: 'Practice your driving test with our experienced instructors. Includes test route familiarization and detailed feedback on your performance.',
    level: 'advanced',
    duration: 75,
    price: '79.00',
    maxStudents: 1,
    transmissionType: 'manual',
    isRecommended: true
  }
];

async function seedCoursesViaAPI() {
  console.log('Starting to seed courses via API...');
  
  for (const course of newCourses) {
    try {
      const response = await fetch(`${API_BASE}/api/admin/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created course: ${course.title}`);
      } else {
        const error = await response.text();
        console.log(`⚠️  Could not create course ${course.title}: ${error}`);
      }
    } catch (error) {
      console.error(`❌ Error creating course ${course.title}:`, error.message);
    }
  }
  
  // Verify by fetching all courses
  try {
    const response = await fetch(`${API_BASE}/api/courses`);
    if (response.ok) {
      const courses = await response.json();
      console.log('\nCurrent courses in database:');
      courses.forEach(course => {
        console.log(`- ${course.title} (£${course.price}) - ${course.level}`);
      });
    }
  } catch (error) {
    console.log('Could not fetch courses for verification');
  }
  
  console.log('\n🎉 Course seeding completed!');
}

seedCoursesViaAPI();