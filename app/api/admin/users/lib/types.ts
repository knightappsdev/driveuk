export interface UserApiResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  phone?: string;
  role: 'admin' | 'instructor' | 'student';
  city?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'instructor' | 'student';
  city?: string;
}