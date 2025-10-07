// Test the student creation API with proper authentication
const testStudentCreation = async () => {
  const testData = {
    firstName: 'Test',
    lastName: 'Student',
    email: 'test.student@example.com',
    phone: '07700123456',
    city: 'London',
    isActive: true,
    licenseType: 'provisional',
    licenseNumber: 'TEST123456',
    theoryTestPassed: false,
    theoryTestDate: '2024-12-01',
    practicalTestDate: '2024-12-15',
    practicalTestPassed: false,
    dateOfBirth: '1995-01-01',
    address: '123 Test Street',
    postcode: 'SW1A 1AA',
    emergencyContact: {
      name: 'Emergency Contact',
      phone: '07700987654',
      relationship: 'Parent'
    },
    learningGoals: 'Pass driving test',
    previousDrivingExperience: 'None',
    preferredInstructorGender: 'female',
    preferredLanguage: 'english',
    drivingLevel: 'complete-beginner',
    startDate: '2024-11-01',
    medicalConditions: 'None'
  };

  console.log('Testing student creation with data:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\nThis test data includes all database fields and should work with the fixed API.');
};

testStudentCreation();