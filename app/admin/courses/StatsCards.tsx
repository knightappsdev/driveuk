import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Star, DollarSign } from 'lucide-react';
import { Course } from './types';

interface StatsCardsProps {
  courses: Course[];
}

export default function StatsCards({ courses }: StatsCardsProps) {
  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.isActive).length;
  const recommendedCourses = courses.filter(c => c.isRecommended).length;
  
  const averagePrice = courses.length > 0 
    ? (courses.reduce((sum, course) => sum + parseFloat(course.price), 0) / courses.length).toFixed(0)
    : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-green-600">{activeCourses}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recommended</p>
              <p className="text-2xl font-bold text-yellow-600">{recommendedCourses}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Price</p>
              <p className="text-2xl font-bold text-blue-600">£{averagePrice}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}