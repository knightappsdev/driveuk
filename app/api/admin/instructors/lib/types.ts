import { db } from '@/lib/db/drizzle';
import { users, instructors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface InstructorApiResponse {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  userAvatar: string | null;
  userIsActive: boolean;
  userCreatedAt: string;
  licenseNumber: string;
  experience: number;
  specialties: string[];
  transmissionTypes: string[];
  pricePerHour: string;
  location: string;
  bio: string;
  availability: string;
  languages: string[];
  nationality: string;
  religion: string;
  ethnicity: string;
  gender: string;
  isApproved: boolean;
  adiBadgeNumber?: string;
  adiGrade?: string;
  yearsExperience?: number;
  hourlyRate?: string;
  weeklyAvailability?: any;
  instructorSummary?: string;
  qualifications?: string;
  baseCity?: string;
  businessAddress?: string;
  isActive?: boolean;
  teachingExpertise?: string;
  adiNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  city?: string;
}

export interface CreateInstructorRequest extends CreateUserRequest {
  // ADI Details
  adiBadgeNumber: string;
  adiGrade: 'grade_4' | 'grade_5' | 'grade_6' | 'trainee';
  
  // Professional Details
  yearsExperience: number;
  hourlyRate: number;
  specialties: string[];
  instructorSummary?: string;
  qualifications?: string;
  weeklyAvailability?: any;
  availability?: string;
  
  // Location & Contact
  baseCity: string;
  businessAddress?: string;
  businessPostcode?: string;
  whatsappNumber?: string;
  
  // Vehicle Details
  vehicleDetails?: string;
  carMake?: string;
  carModel?: string;
  carYear?: number;
  carType?: 'manual' | 'automatic';
  carFuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  vehicleRegistration?: string;
  transmissionTypes?: string[];
  
  // Insurance Details
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  
  // Additional Details
  ethnicity?: string;
  religion?: string;
  bio?: string;
  teachingExpertise?: string;
  adiNumber?: string;
}