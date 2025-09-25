'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  X, 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Heart
} from 'lucide-react';

interface Student {
  id: number;
  userId: number;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  licenseStatus: 'none' | 'provisional' | 'full';
  medicalConditions?: string;
  createdAt: string;
  updatedAt: string;
  // User fields
  userName: string;
  userEmail: string;
  userPhone?: string;
  userAvatar?: string;
  userIsActive: boolean;
  userCreatedAt: string;
}

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

const licenseStatusColors = {
  none: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  provisional: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  full: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
};

const licenseStatusLabels = {
  none: 'No License',
  provisional: 'Provisional License',
  full: 'Full License',
};

export default function StudentDetailsModal({ isOpen, onClose, student }: StudentDetailsModalProps) {
  if (!isOpen || !student) return null;

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'Unknown';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Student Details
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Header Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
              {student.userAvatar ? (
                <img 
                  src={student.userAvatar} 
                  alt={student.userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-medium text-gray-700 dark:text-gray-300">
                  {student.userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {student.userName}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{student.userEmail}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={licenseStatusColors[student.licenseStatus]}>
                  {licenseStatusLabels[student.licenseStatus]}
                </Badge>
                <Badge variant={student.userIsActive ? 'default' : 'secondary'} className="flex items-center gap-1">
                  {student.userIsActive ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {student.userIsActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Student ID:</span>
                  <span className="text-sm text-gray-900 dark:text-white">#{student.id}</span>
                </div>
                {student.dateOfBirth && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Age:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {calculateAge(student.dateOfBirth)} years old
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Date of Birth:</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not provided'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Email:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{student.userEmail}</span>
                </div>
                {student.userPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Phone:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{student.userPhone}</span>
                  </div>
                )}
                {student.emergencyContact && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Emergency:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{student.emergencyContact}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          {student.address && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-900 dark:text-white">{student.address}</p>
              </div>
            </div>
          )}

          {/* License Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4" />
              License Information
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">License Status:</span>
                <Badge className={licenseStatusColors[student.licenseStatus]}>
                  {licenseStatusLabels[student.licenseStatus]}
                </Badge>
              </div>
            </div>
          </div>

          {/* Medical Conditions */}
          {student.medicalConditions && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Medical Conditions
              </h4>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {student.medicalConditions}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Account Timeline
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Account Created:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(student.userCreatedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Profile Created:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(student.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Last Updated:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(student.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-4">
            <Button
              onClick={onClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}