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
  Clock,
  DollarSign,
  Award,
  CheckCircle,
  XCircle,
  Car,
  Globe,
  Heart,
  Users
} from 'lucide-react';

interface Instructor {
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
  // User fields
  userName: string;
  userEmail: string;
  userPhone?: string;
  userAvatar?: string;
  userIsActive: boolean;
  userCreatedAt: string;
}

interface InstructorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructor: Instructor | null;
}

const approvalColors = {
  true: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  false: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
};

export default function InstructorDetailsModal({ isOpen, onClose, instructor }: InstructorDetailsModalProps) {
  if (!isOpen || !instructor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Instructor Details
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
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
              {instructor.userAvatar ? (
                <img 
                  src={instructor.userAvatar} 
                  alt={instructor.userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-medium text-gray-700 dark:text-gray-300">
                  {instructor.userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {instructor.userName}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{instructor.userEmail}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={approvalColors[instructor.isApproved.toString() as keyof typeof approvalColors]}>
                  {instructor.isApproved ? (
                    <><CheckCircle className="h-3 w-3 mr-1" />Approved</>
                  ) : (
                    <><Clock className="h-3 w-3 mr-1" />Pending Approval</>
                  )}
                </Badge>
                <Badge variant={instructor.userIsActive ? 'default' : 'secondary'} className="flex items-center gap-1">
                  {instructor.userIsActive ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {instructor.userIsActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Email:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{instructor.userEmail}</span>
                </div>
                {instructor.userPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Phone:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{instructor.userPhone}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Location:</span>
                  <span className="text-sm text-gray-900 dark:text-white flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {instructor.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="h-4 w-4" />
                Professional Information
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">License:</span>
                  <span className="text-sm text-gray-900 dark:text-white font-mono">
                    {instructor.licenseNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Experience:</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {instructor.experience} years
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Rate:</span>
                  <span className="text-sm text-gray-900 dark:text-white font-semibold">
                    £{instructor.pricePerHour}/hour
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Specialties & Transmission Types */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Car className="h-4 w-4" />
              Teaching Specialties
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Specialties:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {instructor.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Transmission Types:</span>
                <div className="flex gap-2 mt-2">
                  {instructor.transmissionTypes.map((type, index) => (
                    <Badge key={index} variant="outline">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          {(instructor.gender || instructor.nationality || instructor.languages) && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-4 w-4" />
                Personal Information
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
                {instructor.gender && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Gender:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{instructor.gender}</span>
                  </div>
                )}
                {instructor.nationality && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Nationality:</span>
                    <span className="text-sm text-gray-900 dark:text-white flex items-center">
                      <Globe className="w-3 h-3 mr-1" />
                      {instructor.nationality}
                    </span>
                  </div>
                )}
                {instructor.languages && instructor.languages.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Languages:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {instructor.languages.map((language, index) => (
                        <Badge key={index} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {instructor.religion && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Religion:</span>
                    <span className="text-sm text-gray-900 dark:text-white flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {instructor.religion}
                    </span>
                  </div>
                )}
                {instructor.ethnicity && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Ethnicity:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{instructor.ethnicity}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bio & Availability */}
          {(instructor.bio || instructor.availability) && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Additional Information</h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
                {instructor.bio && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Bio:</span>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{instructor.bio}</p>
                  </div>
                )}
                {instructor.availability && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Availability:</span>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{instructor.availability}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">User Created:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(instructor.userCreatedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Profile Created:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(instructor.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Last Updated:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(instructor.updatedAt).toLocaleString()}
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