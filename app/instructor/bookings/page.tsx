'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, AlertCircle, List, Eye } from 'lucide-react';
import AdvancedCalendar from '@/components/driving-school/booking/advanced-calendar';

export default function BookingsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {viewMode === 'calendar' ? 'Advanced Calendar View' : 'Booking Requests'}
          </h1>
          <p className="text-lg text-gray-600">
            {viewMode === 'calendar' 
              ? 'Interactive calendar with real-time availability and booking management'
              : 'Manage incoming lesson requests and bookings'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className={viewMode === 'calendar' ? 'bg-white shadow-sm' : ''}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-white shadow-sm' : ''}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <AdvancedCalendar />
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">5</div>
            <p className="text-sm text-gray-600">Pending Requests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-sm text-gray-600">Confirmed Today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">28</div>
            <p className="text-sm text-gray-600">This Week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">2</div>
            <p className="text-sm text-gray-600">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Bookings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Pending Approval
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold">Rachel Martinez</h4>
                <p className="text-sm text-gray-600">Beginner Course - First Lesson</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">March 18, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">2:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
              <Button variant="outline" size="sm" className="bg-green-500 text-white hover:bg-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button variant="outline" size="sm" className="bg-red-500 text-white hover:bg-red-600">
                <XCircle className="h-4 w-4 mr-1" />
                Decline
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold">David Kim</h4>
                <p className="text-sm text-gray-600">Intensive Course - Highway Practice</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">March 19, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">10:00 AM</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
              <Button variant="outline" size="sm" className="bg-green-500 text-white hover:bg-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button variant="outline" size="sm" className="bg-red-500 text-white hover:bg-red-600">
                <XCircle className="h-4 w-4 mr-1" />
                Decline
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmed Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Confirmed Bookings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold">Sarah Johnson</h4>
                <p className="text-sm text-gray-600">Regular Lesson - City Driving</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Today, March 15</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">10:00 AM</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-1" />
                Message
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold">Michael Chen</h4>
                <p className="text-sm text-gray-600">Advanced Practice - Parallel Parking</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Today, March 15</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">2:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-1" />
                Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Notice */}
      <Card className="mt-8">
        <CardContent className="text-center p-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Booking Management</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Automated booking confirmations, payment processing, calendar sync, and student communication 
            tools are being developed to streamline your booking workflow.
          </p>
        </CardContent>
      </Card>
        </div>
      )}
    </div>
  );
}