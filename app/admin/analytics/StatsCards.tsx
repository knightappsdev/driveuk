import { Card, CardContent } from '@/components/ui/card';
import { 
  Users,
  DollarSign,
  Calendar,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { AdminStats } from './types';
import { formatCurrency, formatPercentage } from './utils';

interface StatsCardsProps {
  stats: AdminStats | null;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% this month
              </p>
            </div>
            <Users className="h-10 w-10 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8% this month
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <TrendingDown className="w-4 h-4 mr-1" />
                -3% this month
              </p>
            </div>
            <Calendar className="h-10 w-10 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Instructors</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalInstructors}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +5% this month
              </p>
            </div>
            <GraduationCap className="h-10 w-10 text-indigo-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +15% this month
              </p>
            </div>
            <Users className="h-10 w-10 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Courses</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <BookOpen className="w-4 h-4 mr-1" />
                Active courses
              </p>
            </div>
            <BookOpen className="h-10 w-10 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Lessons</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedLessons}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                {Math.round((stats.completedLessons / stats.totalBookings) * 100)}% completion rate
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</p>
              <p className="text-sm text-yellow-600 flex items-center mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                Requires attention
              </p>
            </div>
            <AlertCircle className="h-10 w-10 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}