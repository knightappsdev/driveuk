export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  postcode: string;
  city: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  role: 'student' | 'instructor' | 'admin';
  joinDate: string;
  isEmailVerified: boolean;
  profilePicture?: string | null;
  licenseNumber?: string;
  learningGoals?: string;
  adiNumber?: string;
  hourlyRate?: number;
  bio?: string;
}

export interface EditableFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'date';
  placeholder?: string;
}

export const roleColors = {
  student: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  instructor: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
};

export const roleLabels = {
  student: 'Student',
  instructor: 'Instructor',
  admin: 'Administrator',
};