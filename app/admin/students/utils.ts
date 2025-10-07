import { Student } from './types';

export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const response = await fetch('/api/admin/students');
    if (response.ok) {
      const data = await response.json();
      console.log('Students API Response:', data);
      
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      } else {
        console.error('Invalid API response format:', data);
        return [];
      }
    } else {
      console.error('Failed to fetch students:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

export const deleteStudent = async (studentId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/students/${studentId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to delete student:', error);
    return false;
  }
};

export const updateStudent = async (studentId: number, studentData: Partial<Student>): Promise<boolean> => {
  try {
    console.log('Updating student ID:', studentId, 'with data:', studentData);
    const response = await fetch(`/api/admin/students/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    
    console.log('Update response status:', response.status);
    const responseData = await response.json();
    console.log('Update response data:', responseData);
    
    if (!response.ok) {
      console.error('Update failed with status:', response.status, responseData);
    }
    
    return response.ok;
  } catch (error) {
    console.error('Failed to update student:', error);
    return false;
  }
};

export const getStudent = async (studentId: number): Promise<Student | null> => {
  try {
    const response = await fetch(`/api/admin/students/${studentId}`);
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch student:', error);
    return null;
  }
};

export const createStudent = async (studentData: Partial<Student>): Promise<boolean> => {
  try {
    const response = await fetch('/api/admin/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to create student:', error);
    return false;
  }
};

export const filterStudents = (
  students: Student[],
  searchTerm: string,
  selectedStatus: string
): Student[] => {
  return students.filter(student => {
    const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
    const studentEmail = student.email || '';
    
    const matchesSearch = 
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && student.isActive) ||
      (selectedStatus === 'inactive' && !student.isActive);
    
    return matchesSearch && matchesStatus;
  });
};