// Test message delivery system
const testMessageDelivery = async () => {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('🧪 Testing message delivery system...');

    // Test 1: Login as admin
    console.log('\n1. Testing admin login...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@driveuk.com',
        password: 'Admin123!'
      }),
    });

    if (!loginResponse.ok) {
      console.error('❌ Admin login failed:', loginResponse.status);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Admin login successful');

    // Extract session cookie
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    const sessionCookie = setCookieHeader ? setCookieHeader.split(';')[0] : '';

    // Test 2: Fetch existing messages
    console.log('\n2. Testing admin messages fetch...');
    const messagesResponse = await fetch(`${baseUrl}/api/admin/messages`, {
      headers: {
        'Cookie': sessionCookie,
      },
    });

    if (!messagesResponse.ok) {
      console.error('❌ Messages fetch failed:', messagesResponse.status);
      return;
    }

    const messagesData = await messagesResponse.json();
    console.log('✅ Messages fetch successful');
    console.log(`📨 Found ${messagesData.conversations?.length || 0} conversations`);

    // Test 3: Send a message to student
    console.log('\n3. Testing message sending to student...');
    const sendMessageResponse = await fetch(`${baseUrl}/api/admin/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie,
      },
      body: JSON.stringify({
        recipientId: '3', // Student ID (assuming it's 3 from demo data)
        subject: 'Test Message from Admin',
        content: 'This is a test message to verify the delivery system is working correctly.'
      }),
    });

    if (!sendMessageResponse.ok) {
      console.error('❌ Message send failed:', sendMessageResponse.status);
      const errorData = await sendMessageResponse.text();
      console.error('Error details:', errorData);
      return;
    }

    const sendData = await sendMessageResponse.json();
    console.log('✅ Message sent successfully');
    console.log('📤 Message details:', sendData.data);

    // Test 4: Verify message appears in admin messages
    console.log('\n4. Verifying message appears in admin messages...');
    const updatedMessagesResponse = await fetch(`${baseUrl}/api/admin/messages`, {
      headers: {
        'Cookie': sessionCookie,
      },
    });

    if (updatedMessagesResponse.ok) {
      const updatedMessagesData = await updatedMessagesResponse.json();
      console.log('✅ Updated messages fetched');
      console.log(`📨 Now showing ${updatedMessagesData.conversations?.length || 0} conversations`);
      
      if (updatedMessagesData.conversations?.length > messagesData.conversations?.length) {
        console.log('🎉 New conversation created successfully!');
      }
    }

    console.log('\n✅ Message delivery test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Run the test
testMessageDelivery();