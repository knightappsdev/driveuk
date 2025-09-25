'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, BookOpen, Star, Clock, TrendingUp } from 'lucide-react';

export default function InstructorDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructor Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome back! Here&apos;s your teaching overview.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-600">Active Students</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <CalendarDays className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-600">Today&apos;s Lessons</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-purple-100 rounded-full mr-4">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-orange-100 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">£2,840</p>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Sarah M.</h4>
                  <p className="text-sm text-gray-600">Beginner Lesson</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">10:00 AM</p>
                  <Badge variant="secondary">Confirmed</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">John D.</h4>
                  <p className="text-sm text-gray-600">Advanced Practice</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">2:00 PM</p>
                  <Badge variant="secondary">Confirmed</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Emma L.</h4>
                  <p className="text-sm text-gray-600">Mock Test</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">4:30 PM</p>
                  <Badge variant="secondary">Confirmed</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium">New student enrollment</p>
                <p className="text-sm text-gray-600">Rachel T. enrolled in Beginner Course</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-medium">Lesson completed</p>
                <p className="text-sm text-gray-600">Mark S. completed Advanced Practice</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <p className="font-medium">Review received</p>
                <p className="text-sm text-gray-600">5-star review from Lisa K.</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Notice */}
      <Card>
        <CardContent className="text-center p-8">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Dashboard Coming Soon</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We&apos;re working on building comprehensive instructor tools including detailed student management, 
            lesson planning, progress tracking, and earnings analytics. Stay tuned for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}