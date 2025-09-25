'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  X, 
  BookOpen,
  Clock,
  DollarSign,
  Calendar,
  Star,
  Users,
  CheckCircle,
  XCircle,
  Award,
  List
} from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  level: 'absolute-beginner' | 'beginner' | 'intermediate' | 'advanced';
  totalHours: number;
  price: string;
  features: string[];
  color: string;
  isRecommended: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  studentCount: number;
}

interface CourseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

const levelColors = {
  'absolute-beginner': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'beginner': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'advanced': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

const levelLabels = {
  'absolute-beginner': 'Absolute Beginner',
  'beginner': 'Beginner',
  'intermediate': 'Intermediate',
  'advanced': 'Advanced',
};

export default function CourseDetailsModal({ isOpen, onClose, course }: CourseDetailsModalProps) {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Course Details
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
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {course.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge className={levelColors[course.level]}>
                  {levelLabels[course.level]}
                </Badge>
                <Badge variant={course.isActive ? 'default' : 'secondary'} className="flex items-center gap-1">
                  {course.isActive ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {course.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {course.isRecommended && (
                  <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Recommended
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Information
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Course ID:</span>
                  <span className="text-sm text-gray-900 dark:text-white">#{course.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Level:</span>
                  <Badge className={levelColors[course.level]}>
                    {levelLabels[course.level]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Duration:</span>
                  <span className="text-sm text-gray-900 dark:text-white flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {course.totalHours} hours
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Price:</span>
                  <span className="text-sm text-gray-900 dark:text-white font-semibold flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    £{course.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Enrollment Statistics */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-4 w-4" />
                Enrollment Statistics
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {course.studentCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Students Currently Enrolled
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      £{(parseFloat(course.price) * course.studentCount).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Total Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {course.totalHours * course.studentCount}
                    </div>
                    <div className="text-xs text-gray-500">Total Hours Booked</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Features */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <List className="h-4 w-4" />
              Course Features
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {course.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-900 dark:text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Course Settings */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4" />
              Course Settings
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Color Theme:</span>
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-4 h-4 rounded-full bg-${course.color}-500`}
                    style={{ backgroundColor: course.color === 'blue' ? '#3B82F6' : course.color }}
                  ></div>
                  <span className="text-sm text-gray-900 dark:text-white capitalize">{course.color}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Recommended:</span>
                <Badge variant={course.isRecommended ? 'default' : 'secondary'}>
                  {course.isRecommended ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Status:</span>
                <Badge variant={course.isActive ? 'default' : 'secondary'}>
                  {course.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Course Timeline
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Created:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(course.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Last Updated:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(course.updatedAt).toLocaleString()}
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