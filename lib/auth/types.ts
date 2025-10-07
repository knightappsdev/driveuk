import { z } from 'zod';

// Authentication schemas
export const registerSchema = z.object({
  // Base fields
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  role: z.enum(['student', 'instructor']),
  city: z.string().optional(),
  
  // Student fields
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  postcode: z.string().optional(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string()
  }).optional(),
  licenseNumber: z.string().optional(),
  previousDrivingExperience: z.string().optional(),
  learningGoals: z.string().optional(),
  preferredInstructorGender: z.enum(['male', 'female', 'no_preference']).optional(),
  medicalConditions: z.string().optional(),
  drivingLevel: z.enum(['Theory', 'Practical']).optional(),
  startDate: z.string().optional(),
  
  // Instructor fields
  adiBadgeNumber: z.string().optional(),
  adiGrade: z.enum(['grade_4', 'grade_5', 'grade_6', 'trainee']).optional(),
  yearsExperience: z.number().min(0).max(50).optional(),
  hourlyRate: z.number().min(20).max(100).optional(),
  specialties: z.array(z.string()).optional(),
  instructorSummary: z.string().optional(),
  qualifications: z.string().optional(),
  insuranceCompany: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  vehicleDetails: z.string().optional(),
  transmissionTypes: z.array(z.string()).optional(),
  businessAddress: z.string().optional(),
  businessPostcode: z.string().optional(),
  whatsappNumber: z.string().optional(),
  availability: z.array(z.string()).optional(),
  bio: z.string().optional(),
  teachingExpertise: z.string().optional(),
  adiNumber: z.string().optional(),
}).refine((data) => {
  // Validate instructor-specific required fields
  if (data.role === 'instructor') {
    return data.yearsExperience !== undefined && data.hourlyRate !== undefined &&
           data.vehicleDetails && data.teachingExpertise && data.adiNumber;
  }
  return true;
}, {
  message: "Required instructor fields are missing",
  path: ["role"]
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

// Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// User session type
export interface UserSession {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'instructor' | 'student';
  isEmailVerified: boolean;
  profilePicture?: string;
  sessionId: string;
}

// API Response types
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserSession;
  redirectTo?: string;
}

export interface AuthError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Token types
export interface JWTPayload {
  userId: number;
  sessionId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Constants
export const AUTH_CONSTANTS = {
  SESSION_DURATION: 7 * 24 * 60 * 60, // 7 days in seconds
  EMAIL_VERIFICATION_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  PASSWORD_RESET_EXPIRY: 60 * 60 * 1000, // 1 hour in milliseconds
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_ATTEMPT_WINDOW: 15 * 60 * 1000, // 15 minutes in milliseconds
  COOKIE_NAME: 'auth-token',
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  },
} as const;