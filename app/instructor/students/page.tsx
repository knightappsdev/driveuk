'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Search, Filter } from 'lucide-react';

export default function StudentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Students</h1>
          <p className="text-lg text-gray-600">Manage and track your students' progress</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">SJ</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Sarah Johnson</h3>
                  <p className="text-gray-600">sarah.johnson@email.com</p>
                  <p className="text-sm text-gray-500">Enrolled: Jan 15, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="mb-2">Active</Badge>
                <p className="text-sm text-gray-600">12 lessons completed</p>
                <p className="text-sm text-gray-600">Progress: 75%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">MC</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Michael Chen</h3>
                  <p className="text-gray-600">michael.chen@email.com</p>
                  <p className="text-sm text-gray-500">Enrolled: Feb 3, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-2">In Progress</Badge>
                <p className="text-sm text-gray-600">8 lessons completed</p>
                <p className="text-sm text-gray-600">Progress: 50%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">ET</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Emma Thompson</h3>
                  <p className="text-gray-600">emma.thompson@email.com</p>
                  <p className="text-sm text-gray-500">Enrolled: Dec 20, 2023</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-2">Completed</Badge>
                <p className="text-sm text-gray-600">20 lessons completed</p>
                <p className="text-sm text-gray-600">Test: Passed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Notice */}
      <Card className="mt-8">
        <CardContent className="text-center p-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Student Management</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Detailed student profiles, progress tracking, lesson history, and communication tools are coming soon. 
            This will include integrated scheduling, progress reports, and parent communication features.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}