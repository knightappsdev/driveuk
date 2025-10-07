'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarDays, 
  Users, 
  BookOpen, 
  Star, 
  Clock, 
  TrendingUp, 
  DollarSign,
  Car,
  MessageSquare,
  Settings,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function InstructorDashboard() {
  const [stats, setStats] = useState({
    activeStudents: 0,
    todaysLessons: 0,
    weeklyEarnings: 0,
    averageRating: 0,
    completedLessons: 0,
    thisWeekLessons: 0,
    pendingBookings: 0,
    responseRate: 0
  });

  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorStats();
    fetchTodaySchedule();
  }, []);

  const fetchInstructorStats = async () => {
    try {
      const response = await fetch('/api/instructor/stats');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch instructor stats:', error);
    }
  };

  const fetchTodaySchedule = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/instructor/bookings?date=${today}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTodaySchedule(data.data.map((booking: any) => ({
            time: booking.scheduledTime,
            student: `${booking.studentFirstName} ${booking.studentLastName}`,
            type: booking.lessonType,
            status: booking.status,
            location: booking.pickupLocation || 'TBC'
          })));
        }
      }
    } catch (error) {
      console.error('Failed to fetch today schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Instructor Dashboard 🚗</h1>
            <p className="text-lg text-gray-600">Welcome back! Here's your teaching overview for today.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button>
              <CalendarDays className="w-4 h-4 mr-2" />
              Manage Schedule
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
                <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
                <p className="text-sm text-gray-600">Active Students</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <CalendarDays className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.todaysLessons}</p>
                <p className="text-sm text-gray-600">Today's Lessons</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">£{stats.weeklyEarnings}</p>
                <p className="text-sm text-gray-600">This Week</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-yellow-100 rounded-full mr-4">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Schedule */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-600" />
                    Today's Schedule
                  </div>
                  <Badge variant="secondary">{todaySchedule.length} lessons</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaySchedule.map((lesson, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="w-16 text-center">
                          <p className="font-bold text-lg">{lesson.time}</p>
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold">{lesson.student}</p>
                          <p className="text-sm text-gray-600">{lesson.type}</p>
                          <p className="text-xs text-gray-500">{lesson.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={lesson.status === 'confirmed' ? 'default' : 'secondary'}>
                          {lesson.status}
                        </Badge>
                        <div className="mt-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button className="w-full">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    View Full Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="default">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Add Availability
                  </Button>
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Students
                  </Button>
                  <Button className="w-full" variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Add Lesson Notes
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Car className="w-4 h-4 mr-2" />
                    Update Vehicle Info
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start p-3 bg-orange-50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{stats.pendingBookings} pending bookings</p>
                      <p className="text-xs text-gray-600">Requires your approval</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Insurance renewal reminder</p>
                      <p className="text-xs text-gray-600">Due in 15 days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 bg-green-50 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">2 new messages</p>
                      <p className="text-xs text-gray-600">From students</p>
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