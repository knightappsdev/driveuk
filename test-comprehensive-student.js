// Comprehensive test data for the new student form
const testStudentData = {
  // Personal Information
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe.test@example.com',
  phone: '+44 7700 123456',
  dateOfBirth: '1995-05-15',
  city: 'London',
  address: '123 Test Street, Test Area',
  postcode: 'SW1A 1AA',
  isActive: true,
  
  // License Information
  licenseType: 'provisional',
  licenseNumber: 'DOE12345678901',
  theoryTestPassed: false,
  theoryTestDate: '2024-12-01',
  practicalTestDate: '2024-12-15',
  practicalTestPassed: false,
  
  // Emergency Contact
  emergencyContact: {
    name: 'Jane Doe',
    phone: '+44 7700 987654',
    relationship: 'Mother'
  },
  
  // Learning Information
  learningGoals: 'I want to pass my driving test within 6 months and become a confident driver for commuting to work.',
  previousDrivingExperience: 'I have had 5 lessons with another instructor but decided to switch schools.',
  preferredInstructorGender: 'female',
  preferredLanguage: 'english',
  drivingLevel: 'some-experience',
  startDate: '2024-11-01',
  medicalConditions: 'None'
};

console.log('Test student data structure:');
console.log(JSON.stringify(testStudentData, null, 2));

// Validate that all required database fields are present
const requiredFields = [
  'firstName', 'lastName', 'email', // User fields
  'licenseType', 'theoryTestPassed', 'practicalTestPassed', // License info
  'emergencyContact', 'learningGoals', 'previousDrivingExperience', // Learning info
  'preferredInstructorGender', 'preferredLanguage', 'drivingLevel' // Preferences
];

console.log('\nField validation:');
requiredFields.forEach(field => {
  const hasField = testStudentData.hasOwnProperty(field);
  console.log(`${field}: ${hasField ? '✓' : '✗'}`);
});

console.log('\nTest data is ready for student creation form!');