// Test toggle recommended status API
const testToggleRecommended = async () => {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('🧪 Testing toggle recommended status...');

    // Test: Toggle recommended status of course ID 1
    console.log('\n1. Testing toggle recommended status...');
    const toggleResponse = await fetch(`${baseUrl}/api/admin/courses/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isRecommended: true }),
    });

    console.log('Response status:', toggleResponse.status);
    const responseText = await toggleResponse.text();
    console.log('Response body:', responseText);

    if (toggleResponse.ok) {
      console.log('✅ Toggle recommended status successful');
      
      // Test: Get the course to verify the change
      console.log('\n2. Verifying the change...');
      const getResponse = await fetch(`${baseUrl}/api/admin/courses/1`);
      if (getResponse.ok) {
        const courseData = await getResponse.json();
        console.log('Course isRecommended:', courseData.data.isRecommended);
      }
    } else {
      console.log('❌ Toggle recommended status failed');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
};

// Run the test
testToggleRecommended();