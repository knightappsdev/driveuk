'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Eye,
  MessageSquare
} from 'lucide-react';

interface DashboardStats {
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 156,
    totalInstructors: 12,
    totalStudents: 124,
    totalCourses: 8,
    totalBookings: 89,
    pendingBookings: 15,
    completedLessons: 456,
    totalRevenue: 12540,
    avgRating: 4.6,
  });

  const [loading, setLoading] = useState(false);

  const [recentActivity] = useState([
    { type: 'user', message: 'New student registered: Alice Johnson', time: '2 hours ago', status: 'success' },
    { type: 'instructor', message: 'Instructor approved: Mike Davis', time: '4 hours ago', status: 'success' },
    { type: 'booking', message: '5 lessons completed today', time: '6 hours ago', status: 'info' },
    { type: 'payment', message: 'Payment received: £240', time: '8 hours ago', status: 'success' },
    { type: 'system', message: 'Database backup completed', time: '1 day ago', status: 'info' },
  ]);

  const [recentUsers] = useState([
    { name: 'Alice Johnson', email: 'alice@example.com', role: 'student', status: 'active', joinDate: 'Oct 3, 2025' },
    { name: 'Mike Davis', email: 'mike@example.com', role: 'instructor', status: 'pending', joinDate: 'Oct 2, 2025' },
    { name: 'Sarah Wilson', email: 'sarah@example.com', role: 'student', status: 'active', joinDate: 'Oct 1, 2025' },
    { name: 'John Smith', email: 'john@example.com', role: 'instructor', status: 'active', joinDate: 'Sep 30, 2025' },
  ]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Active Instructors',
      value: stats.totalInstructors,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      title: 'Completed Lessons',
      value: stats.completedLessons,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
    },
    {
      title: 'Total Revenue',
      value: `£${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100 dark:bg-rose-900/20',
    },
    {
      title: 'Average Rating',
      value: stats.avgRating.toFixed(1),
      icon: Star,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard 🛠️</h1>
            <p className="text-lg text-gray-600">Complete platform overview and management controls</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInstructors}</p>
                <p className="text-sm text-gray-600">Instructors</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                <p className="text-sm text-gray-600">Students</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-yellow-100 rounded-full mr-4">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">£{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          activity.status === 'success' ? 'bg-green-600' :
                          activity.status === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'
                        }`}></div>
                        <div>
                          <p className="font-medium text-sm">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                      <Badge variant={
                        activity.status === 'success' ? 'default' :
                        activity.status === 'warning' ? 'secondary' : 'outline'
                      }>
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Users
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="w-3 h-3 mr-1" />
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="font-semibold text-blue-600">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">Joined {user.joinDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={user.role === 'instructor' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        <div className="mt-1">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Bookings</span>
                    <span className="text-lg font-bold">{stats.totalBookings}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pending Approvals</span>
                    <span className="text-lg font-bold text-orange-600">{stats.pendingBookings}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Completed Lessons</span>
                    <span className="text-lg font-bold text-green-600">{stats.completedLessons}</span>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Platform Rating</span>
                      <span className="text-sm text-gray-600">{stats.avgRating}/5.0</span>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(stats.avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">based on 89 reviews</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Management Actions */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Management Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="default">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button className="w-full" variant="outline">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Approve Instructors
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Bookings
                  </Button>
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    System Messages
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{stats.pendingBookings} pending approvals</p>
                      <p className="text-xs text-gray-600">Require admin review</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">System backup completed</p>
                      <p className="text-xs text-gray-600">All data secured</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Platform performance optimal</p>
                      <p className="text-xs text-gray-600">99.9% uptime</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}