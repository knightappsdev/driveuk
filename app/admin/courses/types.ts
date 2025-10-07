export interface Course {
  id: number;
  title: string;
  description?: string;
  level: 'absolute-beginner' | 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes from database
  totalHours?: number; // computed field
  price: string;
  features?: string[]; // optional field that may not exist in database
  color?: string; // optional field
  isRecommended?: boolean; // may not exist in database
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  studentCount?: number; // enrolledStudents from database
  maxStudents?: number;
  enrolledStudents?: number;
  transmissionType?: string;
}

export const levelColors = {
  'absolute-beginner': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'beginner': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'advanced': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

export const levelLabels = {
  'absolute-beginner': 'Absolute Beginner',
  'beginner': 'Beginner',
  'intermediate': 'Intermediate',
  'advanced': 'Advanced',
};

export const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
};