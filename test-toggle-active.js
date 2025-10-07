// Test toggle active status API
const testToggleActive = async () => {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('🧪 Testing toggle active status...');

    // Test: Toggle active status of course ID 1
    console.log('\n1. Testing toggle active status...');
    const toggleResponse = await fetch(`${baseUrl}/api/admin/courses/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive: false }),
    });

    console.log('Response status:', toggleResponse.status);
    const responseText = await toggleResponse.text();
    console.log('Response body:', responseText);

    if (toggleResponse.ok) {
      console.log('✅ Toggle active status successful');
    } else {
      console.log('❌ Toggle active status failed');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
};

// Run the test
testToggleActive();