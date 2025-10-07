// Test script to verify student update fix
const http = require('http');

const testStudentUpdate = async () => {
  const studentId = 5; // Using student ID 5 from the logs
  
  const updateData = {
    firstName: 'Pope',
    lastName: 'Oyenowo',
    email: 'alice.johnson@example.com',
    phone: '07756909876',
    city: 'Middlesex',
    isActive: true,
    licenseType: 'provisional',
    licenseNumber: '',
    theoryTestPassed: true,
    theoryTestDate: '', // This was causing the issue
    practicalTestDate: '', // This was causing the issue
    practicalTestPassed: false,
    dateOfBirth: '1998-02-19',
    address: '123 Main Street, London',
    postcode: 'HA3 7FQ',
    medicalConditions: '',
    learningGoals: '',
    previousDrivingExperience: 'Updated experience',
    preferredInstructorGender: '',
    preferredLanguage: 'english',
    drivingLevel: '',
    startDate: '', // This was causing the issue
    emergencyContact: { name: '', phone: '', relationship: '' }
  };

  const postData = JSON.stringify(updateData);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/admin/students/${studentId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    console.log('Testing student update with date fix...');
    
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('Update response status:', res.statusCode);
          console.log('Update response:', result);
          
          if (res.statusCode === 200) {
            console.log('✅ Student update successful! Date handling fix worked.');
          } else {
            console.log('❌ Student update failed:', result.error);
          }
          resolve(result);
        } catch (error) {
          console.error('❌ Error parsing response:', error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error testing student update:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
};

// Run the test
testStudentUpdate();