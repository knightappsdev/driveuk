import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Calendar,
  BookOpen
} from 'lucide-react';
import { AdminStats, RevenueData, CoursePopularity } from './types';
import { formatCurrency } from './utils';

interface AnalyticsChartsProps {
  stats: AdminStats | null;
  revenueData: RevenueData[];
  coursePopularity: CoursePopularity[];
}

export default function AnalyticsCharts({ 
  stats, 
  revenueData, 
  coursePopularity 
}: AnalyticsChartsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="animate-pulse h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8">{data.month}</span>
                  <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden w-32">
                    <div 
                      className="h-full bg-green-600 rounded-full transition-all"
                      style={{ width: `${(data.revenue / 25000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(data.revenue)}</p>
                  <p className="text-xs text-gray-500">{data.bookings} bookings</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Popularity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Popular Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coursePopularity.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{course.courseTitle}</p>
                  <p className="text-sm text-gray-500">{course.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(course.revenue)}</p>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: `${(course.bookings / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Pending</span>
              </div>
              <span className="font-medium">{stats.pendingBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Completed</span>
              </div>
              <span className="font-medium">{stats.completedLessons}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Total Bookings</span>
              </div>
              <span className="font-medium">{stats.totalBookings}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Active Courses</span>
              </div>
              <span className="font-medium">{stats.totalCourses}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Completion Rate</span>
              </div>
              <span className="font-medium">
                {Math.round((stats.completedLessons / stats.totalBookings) * 100)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Avg Rating</span>
              </div>
              <span className="font-medium">{stats.avgRating}/5.0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}