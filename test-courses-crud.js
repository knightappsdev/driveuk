// Test courses CRUD functionality
const testCoursesCrud = async () => {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('🧪 Testing courses CRUD functionality...');

    // Test 1: Fetch courses
    console.log('\n1. Testing courses fetch...');
    const coursesResponse = await fetch(`${baseUrl}/api/admin/courses`);

    if (!coursesResponse.ok) {
      console.error('❌ Courses fetch failed:', coursesResponse.status);
      const errorText = await coursesResponse.text();
      console.error('Error details:', errorText);
      return;
    }

    const coursesData = await coursesResponse.json();
    console.log('✅ Courses fetch successful');
    console.log(`📚 Found ${coursesData.length || 0} courses`);

    // Test 2: Create a new course
    console.log('\n2. Testing course creation...');
    const newCourse = {
      title: 'Test Driving Course',
      description: 'A comprehensive test course for new drivers',
      level: 'beginner',
      duration: 20,
      price: '299.99',
      totalLessons: 10,
      isActive: true,
      isRecommended: false
    };

    const createResponse = await fetch(`${baseUrl}/api/admin/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCourse),
    });

    if (!createResponse.ok) {
      console.error('❌ Course creation failed:', createResponse.status);
      const errorText = await createResponse.text();
      console.error('Error details:', errorText);
      return;
    }

    const createdCourse = await createResponse.json();
    console.log('✅ Course created successfully');
    console.log('📚 Created course:', createdCourse);

    // Test 3: Fetch courses again to verify creation
    console.log('\n3. Verifying course was added...');
    const updatedCoursesResponse = await fetch(`${baseUrl}/api/admin/courses`);
    
    if (updatedCoursesResponse.ok) {
      const updatedCoursesData = await updatedCoursesResponse.json();
      console.log('✅ Updated courses fetched');
      console.log(`📚 Now showing ${updatedCoursesData.length || 0} courses`);
      
      if (updatedCoursesData.length > coursesData.length) {
        console.log('🎉 New course added successfully!');
      }
    }

    console.log('\n✅ Courses CRUD test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Run the test
testCoursesCrud();