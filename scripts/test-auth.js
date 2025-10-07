// Test Authentication System
// Run this script to test the authentication endpoints

const BASE_URL = 'http://localhost:3000';

const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User',
  role: 'student',
  city: 'London'
};

async function testRegistration() {
  console.log('🧪 Testing User Registration...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const result = await response.json();
    console.log('Registration Response:', result);
    
    if (result.success) {
      console.log('✅ Registration successful!');
      return true;
    } else {
      console.log('❌ Registration failed:', result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    return false;
  }
}

async function testLogin() {
  console.log('🧪 Testing User Login...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const result = await response.json();
    console.log('Login Response:', result);
    
    if (result.success) {
      console.log('✅ Login successful!');
      console.log('User:', result.user);
      console.log('Redirect to:', result.redirectTo);
      return true;
    } else {
      console.log('❌ Login failed:', result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    return false;
  }
}

async function testUserInfo() {
  console.log('🧪 Testing User Info...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      method: 'GET',
      credentials: 'include', // Include cookies
    });

    const result = await response.json();
    console.log('User Info Response:', result);
    
    if (result.success) {
      console.log('✅ User info retrieved successfully!');
      console.log('User:', result.user);
      return true;
    } else {
      console.log('❌ User info failed:', result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ User info error:', error);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Authentication Tests...\n');
  
  // Test registration
  const registrationSuccess = await testRegistration();
  console.log('');
  
  if (registrationSuccess) {
    // Test login
    const loginSuccess = await testLogin();
    console.log('');
    
    if (loginSuccess) {
      // Test user info
      await testUserInfo();
    }
  }
  
  console.log('\n🏁 Tests completed!');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests();
}

export { runTests, testRegistration, testLogin, testUserInfo };