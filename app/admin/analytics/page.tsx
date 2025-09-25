'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  BookOpen,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalInstructors: number;
  totalStudents: number;
  totalCourses: number;
  totalBookings: number;
  pendingBookings: number;
  completedLessons: number;
  totalRevenue: number;
  avgRating: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

interface CoursePopularity {
  courseTitle: string;
  bookings: number;
  revenue: number;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [coursePopularity, setCoursePopularity] = useState<CoursePopularity[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [statsResponse, bookingsResponse, coursesResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/bookings'),
        fetch('/api/admin/courses')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Generate mock revenue data for demo
      const mockRevenueData: RevenueData[] = [
        { month: 'Jan', revenue: 12500, bookings: 45 },
        { month: 'Feb', revenue: 15200, bookings: 52 },
        { month: 'Mar', revenue: 18300, bookings: 61 },
        { month: 'Apr', revenue: 16800, bookings: 58 },
        { month: 'May', revenue: 21400, bookings: 67 },
        { month: 'Jun', revenue: 19600, bookings: 63 },
      ];
      setRevenueData(mockRevenueData);

      // Generate mock course popularity data
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        const mockPopularity: CoursePopularity[] = coursesData.slice(0, 5).map((course: any, index: number) => ({
          courseTitle: course.title,
          bookings: Math.floor(Math.random() * 50) + 10,
          revenue: parseFloat(course.price) * (Math.floor(Math.random() * 50) + 10),
        }));
        setCoursePopularity(mockPopularity);
      }

    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Business insights and performance metrics
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Business insights and performance metrics
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchAnalytics}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Main Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <p className="text-3xl font-bold text-gray-900">£{stats.totalRevenue.toLocaleString()}</p>
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
                <GraduationCap className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">{data.month}</p>
                    <p className="text-sm text-gray-500">{data.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">£{data.revenue.toLocaleString()}</p>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${(data.revenue / 25000) * 100}%` }}
                      ></div>
                    </div>
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
              <BookOpen className="h-5 w-5" />
              Course Popularity
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
                    <p className="font-bold">£{course.revenue.toLocaleString()}</p>
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
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Booking Status</CardTitle>
          </CardHeader>
          <CardContent>
            {stats && (
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
                    <span className="text-sm">Total</span>
                  </div>
                  <span className="font-medium">{stats.totalBookings}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Students</span>
                  </div>
                  <span className="font-medium">{stats.totalStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Instructors</span>
                  </div>
                  <span className="font-medium">{stats.totalInstructors}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(stats.totalStudents / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  {Math.round((stats.totalStudents / stats.totalUsers) * 100)}% Students
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Active Courses</span>
                  </div>
                  <span className="font-medium">{stats.totalCourses}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Avg. Rating</span>
                  </div>
                  <span className="font-medium">{stats.avgRating}/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Completion Rate</span>
                  </div>
                  <span className="font-medium">
                    {stats.totalBookings > 0 ? Math.round((stats.completedLessons / stats.totalBookings) * 100) : 0}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <Calendar className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">View Today&apos;s Bookings</div>
                <div className="text-sm text-gray-500">Check daily schedule</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <AlertCircle className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Pending Approvals</div>
                <div className="text-sm text-gray-500">Review instructor applications</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <DollarSign className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Revenue Report</div>
                <div className="text-sm text-gray-500">Generate monthly report</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}