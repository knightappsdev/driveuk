'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  User, 
  Users, 
  GraduationCap, 
  Shield, 
  MessageCircle, 
  Calendar, 
  BarChart3,
  Settings,
  BookOpen,
  Car,
  Clock,
  Target,
  Copy,
  Eye,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';

export default function DemoCredentialsPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const accounts = [
    {
      role: 'admin',
      title: 'Admin Account',
      email: 'admin@driveuk.com',
      password: 'Admin123!',
      icon: Shield,
      color: 'purple',
      description: 'Complete platform administration and oversight',
      features: [
        'Platform analytics and reporting',
        'User management (students, instructors, admins)',
        'System settings and configuration',
        'Revenue and business metrics',
        'Course and curriculum management',
        'Support ticket management',
        'System monitoring and alerts',
        'Bulk data operations'
      ],
      dashboardAccess: [
        'User overview and statistics',
        'Revenue tracking',
        'System performance metrics',
        'Recent activity logs',
        'Platform health monitoring'
      ]
    },
    {
      role: 'instructor',
      title: 'Instructor Account',
      email: 'instructor@driveuk.com',
      password: 'Instructor123!',
      icon: Users,
      color: 'blue',
      description: 'Teaching and student management interface',
      features: [
        'Student progress tracking',
        'Lesson scheduling and management',
        'Performance analytics',
        'Message students and admin',
        'Profile and qualifications management',
        'Availability calendar',
        'Teaching resources access',
        'Student feedback and notes'
      ],
      dashboardAccess: [
        'Today\'s schedule overview',
        'Student progress summaries',
        'Teaching performance metrics',
        'Upcoming lessons and bookings',
        'Messages and notifications'
      ]
    },
    {
      role: 'student',
      title: 'Student Account',
      email: 'student@driveuk.com',
      password: 'Student123!',
      icon: GraduationCap,
      color: 'green',
      description: 'Learning progress and lesson booking platform',
      features: [
        'Learning progress tracking',
        'Lesson booking and scheduling',
        'Theory test preparation',
        'Message instructor and support',
        'Profile and preferences management',
        'Lesson history and feedback',
        'Practice resources access',
        'Achievement tracking'
      ],
      dashboardAccess: [
        'Learning progress overview',
        'Upcoming lessons schedule',
        'Theory test progress',
        'Recent lesson summaries',
        'Quick action buttons'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-800',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        button: 'bg-green-600 hover:bg-green-700'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Demo Credentials & Platform Guide
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore DriveUK's comprehensive driving school management platform with these pre-configured demo accounts. 
            Each account showcases different user roles and features.
          </p>
          <div className="mt-6">
            <Link href="/sign-in">
              <Button className="mr-4">
                Try Demo Accounts
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">
                Create New Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {accounts.map((account) => {
            const colorClasses = getColorClasses(account.color);
            const Icon = account.icon;
            
            return (
              <Card key={account.role} className={`${colorClasses.bg} ${colorClasses.border} border-2`}>
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${colorClasses.button} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className={`${colorClasses.text} text-xl`}>
                    {account.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-2">
                    {account.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Email:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(account.email, `${account.role}-email`)}
                          className="h-auto p-1"
                        >
                          {copiedField === `${account.role}-email` ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <code className="text-xs bg-gray-100 p-2 rounded block">
                        {account.email}
                      </code>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Password:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(account.password, `${account.role}-password`)}
                          className="h-auto p-1"
                        >
                          {copiedField === `${account.role}-password` ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <code className="text-xs bg-gray-100 p-2 rounded block">
                        {account.password}
                      </code>
                    </div>
                    
                    <Link href="/sign-in">
                      <Button className={`w-full ${colorClasses.button} text-white`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Try This Account
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Feature Breakdown */}
        <div className="space-y-8">
          {accounts.map((account) => {
            const colorClasses = getColorClasses(account.color);
            const Icon = account.icon;
            
            return (
              <Card key={`${account.role}-details`} className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Icon className={`w-6 h-6 mr-3 ${colorClasses.text}`} />
                    {account.title} Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Features */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-gray-600" />
                        Platform Features
                      </h3>
                      <ul className="space-y-2">
                        {account.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Dashboard Access */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
                        Dashboard Overview
                      </h3>
                      <ul className="space-y-2">
                        {account.dashboardAccess.map((access, index) => (
                          <li key={index} className="flex items-start">
                            <Target className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{access}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Getting Started Guide */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-blue-800">
              🎯 Getting Started Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Choose Account</h3>
                <p className="text-sm text-gray-600">Select one of the demo accounts above based on the role you want to explore.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Sign In</h3>
                <p className="text-sm text-gray-600">Use the credentials to log in and access the role-specific dashboard.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Explore Features</h3>
                <p className="text-sm text-gray-600">Navigate through the dashboard, messages, profile, and role-specific features.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Test Interactions</h3>
                <p className="text-sm text-gray-600">Try messaging between roles, updating profiles, and using management tools.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Ready to start your driving school journey?
          </p>
          <div className="space-x-4">
            <Link href="/sign-in">
              <Button>
                Try Demo Now
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}