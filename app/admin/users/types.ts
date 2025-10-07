export interface ApiUser {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  isActive: boolean;
  phone?: string;
  city?: string;
  isEmailVerified?: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export const roleColors = {
  admin: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  instructor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  student: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
};

export const roleLabels = {
  admin: 'Admin',
  instructor: 'Instructor',
  student: 'Student',
};

export const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
};