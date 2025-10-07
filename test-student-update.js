// Test script for student update functionality
const testStudentUpdate = async () => {
  try {
    console.log('Testing student update API...');
    
    // First, let's try to get all students to see if there are any
    const studentsResponse = await fetch('http://localhost:3001/api/admin/students');
    const studentsData = await studentsResponse.json();
    
    console.log('Students API Response:', studentsData);
    
    if (studentsData.success && studentsData.data && studentsData.data.length > 0) {
      const firstStudent = studentsData.data[0];
      console.log('First student:', firstStudent);
      
      // Try to update the first student
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        email: firstStudent.email // Keep same email
      };
      
      console.log('Attempting to update student with ID:', firstStudent.id);
      console.log('Update data:', updateData);
      
      const updateResponse = await fetch(`http://localhost:3001/api/admin/students/${firstStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      const updateResult = await updateResponse.json();
      console.log('Update response status:', updateResponse.status);
      console.log('Update response:', updateResult);
      
    } else {
      console.log('No students found in database');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testStudentUpdate();