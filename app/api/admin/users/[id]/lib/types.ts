export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  role?: 'admin' | 'instructor' | 'student';
}