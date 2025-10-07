const testInstructorRegistration = async () => {
  const payload = {
    email: "test.instructor@example.com",
    password: "TestPassword123!",
    firstName: "Test",
    lastName: "Instructor",
    phone: "07123456789",
    role: "instructor",
    city: "London",
    address: "123 Instructor Street, London",
    postcode: "SW1A 1AA",
    emergencyContact: {
      name: "Jane Doe",
      phone: "07987654321",
      relationship: "spouse"
    },
    vehicleDetails: "Manual",
    availability: ["monday", "tuesday", "wednesday"],
    yearsExperience: 5,
    hourlyRate: 35.50,
    bio: "Experienced driving instructor with 5 years of teaching",
    teachingExpertise: "Manual Transmission",
    adiNumber: "12345"
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.text();
    console.log('Response Status:', response.status);
    console.log('Response:', data);

    if (!response.ok) {
      console.error('Registration failed');
    } else {
      console.log('Registration successful!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testInstructorRegistration();