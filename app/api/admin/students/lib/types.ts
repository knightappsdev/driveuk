export interface StudentApiResponse {
  id: number;
  userId: number;
  licenseType?: string;
  licenseNumber?: string;
  theoryTestPassed?: boolean;
  practicalTestPassed?: boolean;
  dateOfBirth?: string;
  address?: string;
  postcode?: string;
  emergencyContact?: string;
  medicalConditions?: string;
  learningGoals?: string;
  previousDrivingExperience?: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  isActive: boolean;
  role: string;
}