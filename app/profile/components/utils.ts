import { UserData } from './types';

export const mockUserData: UserData = {
  id: 1,
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@example.com',
  phone: '07123456789',
  dateOfBirth: '1995-03-15',
  address: '123 Main Street, London',
  postcode: 'SW1A 1AA',
  city: 'London',
  emergencyContact: {
    name: 'Jane Smith',
    phone: '07987654321',
    relationship: 'spouse'
  },
  role: 'student',
  joinDate: '2024-09-15',
  isEmailVerified: true,
  licenseNumber: 'SMITH123456AB7CD',
  learningGoals: 'Pass my test within 6 months',
  adiNumber: '',
  hourlyRate: 0,
  bio: ''
};

export const updateUserData = async (userData: UserData): Promise<boolean> => {
  try {
    // In a real app, this would call the API
    console.log('Updating user data:', userData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatMemberSince = (joinDate: string): string => {
  return new Date(joinDate).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric'
  });
};