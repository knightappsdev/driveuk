const testData = {
  email: "test.student@example.com",
  password: "TestPassword123!",
  firstName: "Test",
  lastName: "Student",
  phone: "07123456789",
  role: "student",
  dateOfBirth: "2000-01-15",
  address: "123 Test Street, London",
  postcode: "SW1A 1AA",
  emergencyContact: {
    name: "Jane Doe",
    phone: "07987654321",
    relationship: "parent"
  },
  licenseNumber: "STUDEN123456AB7CD",
  previousDrivingExperience: "None",
  learningGoals: "Pass my test within 6 months",
  preferredInstructorGender: "no_preference",
  medicalConditions: ""
};

fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => console.log('Response:', data))
.catch(error => console.error('Error:', error));