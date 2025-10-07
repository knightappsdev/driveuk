// Types for Student data
export interface Student {
  id: number;
  userId: number;
  // License Information
  licenseType: string;
  licenseNumber?: string;
  theoryTestPassed: boolean;
  theoryTestDate?: string;
  practicalTestDate?: string;
  practicalTestPassed: boolean;
  // Personal Information
  dateOfBirth?: string;
  address?: string;
  postcode?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  medicalConditions?: string;
  // Learning Information
  learningGoals?: string;
  previousDrivingExperience?: string;
  preferredInstructorGender?: string;
  preferredLanguage?: string;
  drivingLevel?: string;
  startDate?: string;
  // Timestamps
  createdAt: string;
  updatedAt: string;
  // User fields
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  isActive: boolean;
  role: string;
}

// Status color configurations
export const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
};

export const testStatusColors = {
  true: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  false: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};