// Test to check if courses exist and create sample courses
const testCourses = async () => {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('🧪 Testing courses API...');

    // Test: Check if courses exist
    console.log('\n1. Checking existing courses...');
    const coursesResponse = await fetch(`${baseUrl}/api/courses`);
    
    console.log('Response status:', coursesResponse.status);
    const coursesData = await coursesResponse.json();
    console.log('Courses data:', JSON.stringify(coursesData, null, 2));

    if (coursesData.count === 0) {
      console.log('\n2. No courses found. Creating sample courses...');
      
      // Create sample courses
      const sampleCourses = [
        {
          title: "Beginner Driving Course",
          description: "Perfect for absolute beginners. Learn the basics of driving with our experienced instructors.",
          price: 299.99,
          duration: 1200, // 20 hours in minutes
          level: "beginner",
          features: "Highway Code training, Basic vehicle controls, City driving practice, Parking techniques"
        },
        {
          title: "Intensive Driving Course",
          description: "Fast-track your driving skills with our intensive course. Ideal for quick learners.",
          price: 499.99,
          duration: 1800, // 30 hours in minutes
          level: "intermediate",
          features: "Accelerated learning, Test preparation, Mock driving tests, Advanced maneuvers"
        },
        {
          title: "Pass Plus Course",
          description: "Advanced driving course for newly qualified drivers. Improve your skills and confidence.",
          price: 199.99,
          duration: 600, // 10 hours in minutes
          level: "advanced",
          features: "Motorway driving, Night driving, All weather conditions, Advanced hazard perception"
        }
      ];

      for (const course of sampleCourses) {
        try {
          const createResponse = await fetch(`${baseUrl}/api/admin/courses`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(course),
          });

          const result = await createResponse.json();
          console.log(`Created course: ${course.title} - Status: ${createResponse.status}`);
          if (!createResponse.ok) {
            console.log('Error:', result);
          }
        } catch (error) {
          console.error(`Failed to create course ${course.title}:`, error.message);
        }
      }

      // Check courses again after creation
      console.log('\n3. Checking courses after creation...');
      const newCoursesResponse = await fetch(`${baseUrl}/api/courses`);
      const newCoursesData = await newCoursesResponse.json();
      console.log('New courses count:', newCoursesData.count);
      console.log('New courses:', JSON.stringify(newCoursesData, null, 2));
    } else {
      console.log(`✅ Found ${coursesData.count} courses in the database`);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
};

// Run the test
testCourses();