import { getCurrentUser } from '@/lib/auth/auth-service';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LogoutButton from '@/components/auth/logout-button';
import { CalendarDays, BookOpen, Clock, User, Target, CheckCircle, AlertCircle, Car, MessageCircle } from 'lucide-react';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (!user.isEmailVerified) {
    redirect('/verify-email');
  }

  // Mock data - will be replaced with real API calls
  const studentStats = {
    totalLessons: 12,
    completedLessons: 8,
    upcomingLessons: 2,
    theoryProgress: 75,
    practicalProgress: 60,
    nextLesson: "Tomorrow at 2:00 PM",
    instructor: "Sarah Johnson",
    hoursCompleted: 16
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user.firstName}! 🚗
            </h1>
            <p className="text-lg text-gray-600">
              {user.role === 'student' && 'Ready to continue your driving journey?'}
              {user.role === 'instructor' && 'Ready to teach the next generation of drivers?'}
              {user.role === 'admin' && 'Manage your driving school platform'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/profile">
              <Button variant="outline">
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </a>
            <LogoutButton />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{studentStats.totalLessons}</p>
                <p className="text-sm text-gray-600">Total Lessons</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{studentStats.completedLessons}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{studentStats.hoursCompleted}</p>
                <p className="text-sm text-gray-600">Hours Driven</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-orange-100 rounded-full mr-4">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{studentStats.upcomingLessons}</p>
                <p className="text-sm text-gray-600">Upcoming</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Next Lesson Card */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
                  Next Lesson
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg">{studentStats.nextLesson}</p>
                      <p className="text-gray-600">with {studentStats.instructor}</p>
                      <Badge variant="outline" className="mt-2">Practical Lesson</Badge>
                    </div>
                    <div className="text-right">
                      <Button>Join Lesson</Button>
                      <p className="text-sm text-gray-500 mt-2">London, SW1</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Lessons */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Recent Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: "Oct 2, 2025", instructor: "Sarah Johnson", type: "Practical", status: "Completed", rating: 5 },
                    { date: "Sep 30, 2025", instructor: "Sarah Johnson", type: "Theory Support", status: "Completed", rating: 4 },
                    { date: "Sep 28, 2025", instructor: "Sarah Johnson", type: "Practical", status: "Completed", rating: 5 },
                  ].map((lesson, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{lesson.date}</p>
                        <p className="text-sm text-gray-600">{lesson.type} with {lesson.instructor}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={lesson.status === 'Completed' ? 'default' : 'secondary'}>
                          {lesson.status}
                        </Badge>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < lesson.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ⭐
                            </span>
                          ))}
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
            {/* Progress Card */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Theory Knowledge</span>
                      <span className="text-sm text-gray-600">{studentStats.theoryProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${studentStats.theoryProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Practical Skills</span>
                      <span className="text-sm text-gray-600">{studentStats.practicalProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${studentStats.practicalProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium mb-3">Next Milestones</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Highway Driving
                    </div>
                    <div className="flex items-center text-sm">
                      <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                      Parallel Parking
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      Night Driving
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="default">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Book a Lesson
                  </Button>
                  <a href="/theory">
                    <Button className="w-full" variant="outline">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Take Theory Test
                    </Button>
                  </a>
                  <Button className="w-full" variant="outline">
                    <Car className="w-4 h-4 mr-2" />
                    View My Instructor
                  </Button>
                  <a href="/messages" className="block">
                    <Button className="w-full" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Messages
                    </Button>
                  </a>
                  <a href="/profile" className="block">
                    <Button className="w-full" variant="outline">
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{user.firstName} {user.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Role:</span>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email Verified:</span>
                    <Badge variant={user.isEmailVerified ? 'default' : 'destructive'}>
                      {user.isEmailVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Role-specific sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {user.role === 'student' && (
            <>
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Theory Test Practice</h2>
                <p className="text-gray-600 mb-4">
                  Practice with official DVSA questions across all 15 categories. Track your progress and master weak areas.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Progress: {studentStats.theoryProgress}% complete
                  </div>
                  <a href="/theory">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Start Practice →
                    </button>
                  </a>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Book Lessons</h2>
                <p className="text-gray-600 mb-4">
                  Find and book lessons with qualified ADI instructors.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Find Instructors →
                </button>
              </Card>
            </>
          )}

          {user.role === 'instructor' && (
            <>
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">My Schedule</h2>
                <p className="text-gray-600 mb-4">
                  Manage your availability and upcoming lessons.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View Calendar →
                </button>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">My Students</h2>
                <p className="text-gray-600 mb-4">
                  Track student progress and lesson history.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View Students →
                </button>
              </Card>
            </>
          )}

          {user.role === 'admin' && (
            <>
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Platform Analytics</h2>
                <p className="text-gray-600 mb-4">
                  View platform usage and performance metrics.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View Analytics →
                </button>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">User Management</h2>
                <p className="text-gray-600 mb-4">
                  Manage users, instructors, and administrators.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Manage Users →
                </button>
              </Card>
            </>
          )}

          {/* Common features */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Community</h2>
            <p className="text-gray-600 mb-4">
              Connect with other learners and share experiences.
            </p>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Join Forums →
            </button>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Messages</h2>
            <p className="text-gray-600 mb-4">
              Check your messages and notifications.
            </p>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View Messages →
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}