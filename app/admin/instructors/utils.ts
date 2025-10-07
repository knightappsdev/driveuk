import { Instructor } from './types';

export const fetchInstructors = async (): Promise<Instructor[]> => {
  try {
    const response = await fetch('/api/admin/instructors');
    if (response.ok) {
      const data = await response.json();
      console.log('Instructors API Response:', data);
      
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      } else {
        console.error('Invalid API response format:', data);
        return [];
      }
    } else {
      console.error('API request failed:', response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch instructors:', error);
    return [];
  }
};

export const deleteInstructor = async (instructorId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/instructors/${instructorId}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`Instructor ${instructorId} deleted successfully:`, result.message);
      return true;
    } else {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      const errorMessage = errorData.message || response.statusText;
      console.error('Failed to delete instructor:', errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error deleting instructor:', error);
    throw error;
  }
};

export const approveInstructor = async (instructorId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/instructors/${instructorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isApproved: true }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`Instructor ${instructorId} approved successfully:`, result.message);
      return true;
    } else {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      const errorMessage = errorData.message || response.statusText;
      console.error('Failed to approve instructor:', errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error approving instructor:', error);
    throw error;
  }
};

export const filterInstructors = (
  instructors: Instructor[], 
  searchTerm: string, 
  selectedStatus: string
): Instructor[] => {
  return instructors.filter(instructor => {
    const matchesSearch = 
      (instructor.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (instructor.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (instructor.licenseNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (instructor.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'all' || 
      (selectedStatus === 'approved' && instructor.isApproved) ||
      (selectedStatus === 'pending' && !instructor.isApproved) ||
      (selectedStatus === 'active' && instructor.userIsActive) ||
      (selectedStatus === 'inactive' && !instructor.userIsActive);
    
    return matchesSearch && matchesStatus;
  });
};