// Test admin courses API to check if courses exist in database
const testAdminCourses = async () => {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('🧪 Testing admin courses API...');

    // Test: Check admin courses (this should work)
    console.log('\n1. Checking admin courses...');
    const adminResponse = await fetch(`${baseUrl}/api/admin/courses`);
    
    console.log('Admin API response status:', adminResponse.status);
    
    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      console.log('Admin courses data:', JSON.stringify(adminData, null, 2));
    } else {
      const errorText = await adminResponse.text();
      console.log('Admin API error:', errorText);
    }

    // Test: Check public courses API
    console.log('\n2. Testing public courses API...');
    const publicResponse = await fetch(`${baseUrl}/api/courses`);
    
    console.log('Public API response status:', publicResponse.status);
    
    if (publicResponse.ok) {
      const publicData = await publicResponse.json();
      console.log('Public courses data:', JSON.stringify(publicData, null, 2));
    } else {
      const errorText = await publicResponse.text();
      console.log('Public API error:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
};

// Run the test
testAdminCourses();