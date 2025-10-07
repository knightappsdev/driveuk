export interface Instructor {
  id: number;
  userId: number;
  licenseNumber: string;
  experience: number;
  specialties: string[];
  transmissionTypes: string[];
  pricePerHour: string;
  location: string;
  bio?: string;
  availability?: string;
  languages?: string[];
  nationality?: string;
  religion?: string;
  ethnicity?: string;
  gender?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userAvatar?: string;
  userIsActive: boolean;
  userCreatedAt: string;
}

export const approvalColors = {
  'true': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'false': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
};

export const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
};