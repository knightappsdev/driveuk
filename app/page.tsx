'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/driving-school/landing/hero-section';
import UKLicenseProcessEnhanced from '@/components/driving-school/process/uk-license-process-enhanced';
import CourseCard from '@/components/driving-school/courses/course-card';
import CourseModal from '@/components/driving-school/courses/course-modal';
import CustomCourseCard from '@/components/driving-school/custom-course-card';
import CustomCourseModal from '@/components/driving-school/custom-course-modal';
import { CoursePurchaseCounter } from '@/components/ui/course-purchase-counter';
import DynamicInstructorSection from '@/components/driving-school/instructors/dynamic-instructor-section';
import JoinPlatformCTA from '@/components/driving-school/instructors/join-platform-cta';
import WhatsAppWidget from '@/components/driving-school/whatsapp/whatsapp-widget';
import ExitIntentPopup from '@/components/driving-school/retargeting/exit-intent-popup';
import ScrollToTop from '@/components/scroll-to-top';
import StudentAuthModal from '@/components/auth/student-auth-modal';
import Footer from '@/components/footer';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Course } from '@/components/driving-school/courses/course-card';
import { useExitIntent } from '@/hooks/use-exit-intent';
import { useAuth } from '@/hooks/use-auth';
import { ArrowRight, Star, Users, CheckCircle, Calendar, MessageCircle, Bell, BookOpen } from 'lucide-react';
import TheoryCtaSection from '@/components/driving-school/theory-cta-section';

export default function HomePage() {
  const { user, isAuthenticated, isStudent, loading: authLoading } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isCustomCourseModalOpen, setIsCustomCourseModalOpen] = useState(false);
  const [isExitIntentPopupOpen, setIsExitIntentPopupOpen] = useState(false);
  const [showWhatsAppOnExit, setShowWhatsAppOnExit] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isStudentAuthModalOpen, setIsStudentAuthModalOpen] = useState(false);
  const [pendingCourse, setPendingCourse] = useState<{ course: Course; transmissionType: string } | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [lastCourseUpdate, setLastCourseUpdate] = useState<Date | null>(null);


  // Fetch courses from API with real-time updates
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses);
          setLastCourseUpdate(new Date());
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        // Fallback to empty array if API fails
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    // Initial fetch
    fetchCourses();

    // Set up periodic refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      if (!coursesLoading) {
        fetchCourses();
      }
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [coursesLoading]);

  // Exit intent detection
  useExitIntent({
    onExitIntent: () => {
      if (!isExitIntentPopupOpen) {
        setIsExitIntentPopupOpen(true);
        setShowWhatsAppOnExit(true);
      }
    }
  });

  const handleCourseViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleCustomCourseViewDetails = () => {
    setIsCustomCourseModalOpen(true);
  };

  const handleBookCourse = async (course: Course, transmissionType: string) => {
    console.log('Booking course:', course.title, 'Transmission:', transmissionType);
    
    // Close the course modal first
    setIsCourseModalOpen(false);
    
    // Check if user is authenticated and is a student
    if (!isAuthenticated) {
      // Store the course details for after authentication
      setPendingCourse({ course, transmissionType });
      setIsStudentAuthModalOpen(true);
      return;
    }
    
    if (!isStudent) {
      // If user is not a student (instructor/admin), redirect to student registration
      alert('Please create a student account to book courses. Redirecting to registration...');
      setPendingCourse({ course, transmissionType });
      setIsStudentAuthModalOpen(true);
      return;
    }
    
    // User is authenticated as a student - proceed with booking
    proceedWithBooking(course, transmissionType);
  };

  const proceedWithBooking = (course: Course, transmissionType: string) => {
    // TODO: Implement actual booking logic
    console.log('Proceeding with booking for authenticated student:', {
      user: user?.email,
      course: course.title,
      transmissionType
    });
    
    // For now, redirect to dashboard or show success message
    alert(`Booking initiated for ${course.title}! You will be redirected to your dashboard to complete the booking.`);
    
    // In a real implementation, you might:
    // 1. Create a booking record
    // 2. Redirect to payment
    // 3. Send confirmation email
    // 4. Update course enrollment
    
    // For now, just redirect to dashboard
    window.location.href = '/dashboard';
  };

  const handleBookCustomCourse = async (selectedSkills: string[], totalCost: number) => {
    console.log('Booking custom course:', { selectedSkills, totalCost });
    
    // Check if user is authenticated and is a student
    if (!isAuthenticated) {
      setIsStudentAuthModalOpen(true);
      return;
    }
    
    if (!isStudent) {
      alert('Please create a student account to book courses. Redirecting to registration...');
      setIsStudentAuthModalOpen(true);
      return;
    }
    
    // User is authenticated as a student - proceed with custom booking
    console.log('Proceeding with custom course booking for authenticated student:', {
      user: user?.email,
      selectedSkills,
      totalCost,
      estimatedHours: selectedSkills.length
    });
    
    alert(`Custom course booking initiated! Total cost: £${totalCost} for ${selectedSkills.length} skill${selectedSkills.length !== 1 ? 's' : ''}. You will be redirected to your dashboard to complete the booking.`);
    
    // In a real implementation, you might:
    // 1. Create a custom course record with selected skills
    // 2. Redirect to payment
    // 3. Send confirmation email with skill breakdown
    // 4. Schedule individual sessions for each skill
    
    // For now, just redirect to dashboard
    window.location.href = '/dashboard';
  };

  const handleStudentAuthSuccess = () => {
    // Authentication successful, proceed with pending booking
    if (pendingCourse) {
      proceedWithBooking(pendingCourse.course, pendingCourse.transmissionType);
      setPendingCourse(null);
    }
    setIsStudentAuthModalOpen(false);
  };

  const handleMaybeLater = () => {
    setIsExitIntentPopupOpen(true);
  };



  const handleExitIntentSubmit = async (data: { email: string; phone: string; name: string }) => {
    console.log('Exit intent form submitted:', data);
    const message = `New free lesson request from ${data.name}\\nEmail: ${data.email}\\nPhone: ${data.phone}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/447756183484?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };



  const handleBookLessons = () => {
    // Check authentication status
    if (!isAuthenticated) {
      // Not authenticated - show authentication modal
      setIsStudentAuthModalOpen(true);
      return;
    }
    
    if (!isStudent) {
      // Authenticated but not a student - redirect to student registration
      alert('Please create a student account to book lessons. You can sign up below.');
      setIsStudentAuthModalOpen(true);
      return;
    }
    
    // User is authenticated as a student - scroll to courses
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookLessonsSuccess = () => {
    // After successful authentication, scroll to courses
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
    setIsStudentAuthModalOpen(false);
  };

  const handleFreeConsultation = () => {
    const message = `Hi! I'd like a free consultation to discuss my driving learning needs and get personalized advice on the best course for me.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/447756183484?text=${encodedMessage}`, '_blank');
  };

  // Notifications removed - functionality simplified
  const handleEnableNotifications = () => {
    alert('Notifications have been disabled in this version');
  };

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <HeroSection onBookLessons={handleBookLessons} onFreeConsultation={handleFreeConsultation} />

      {/* Enhanced UK License Process Section */}
      <UKLicenseProcessEnhanced />

      {/* Theory Test CTA Section */}
      <TheoryCtaSection />

      {/* Courses Section */}
      <section id="courses" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Choose Your Perfect Course</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From complete beginners to advanced drivers, we have the perfect course for your skill level
            </p>
          </div>

          {coursesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-80"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Regular Courses */}
              {courses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onViewDetails={handleCourseViewDetails}
                />
              ))}
              
              {/* Custom Course Card */}
              <CustomCourseCard onViewDetails={handleCustomCourseViewDetails} />
            </div>
          )}
          
          {!coursesLoading && courses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No courses available</h3>
              <p className="text-gray-600">Courses are being updated. Please check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Student Dashboard Section - Only shown to authenticated students */}
      {isAuthenticated && isStudent && (
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Your Learning Dashboard</h2>
              <p className="text-xl text-gray-600">Quick access to your learning tools and progress</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Theory Test Practice */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/theory'}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Theory Test Practice</h3>
                  <p className="text-gray-600 text-sm mb-4">Practice DVSA questions across 15 categories</p>
                  <Button className="w-full" size="sm">Start Practice</Button>
                </CardContent>
              </Card>

              {/* Book Lessons */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/dashboard'}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">My Dashboard</h3>
                  <p className="text-gray-600 text-sm mb-4">View lessons, progress, and schedule</p>
                  <Button className="w-full" variant="outline" size="sm">View Dashboard</Button>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/messages'}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Messages</h3>
                  <p className="text-gray-600 text-sm mb-4">Chat with your instructor and support</p>
                  <Button className="w-full" variant="outline" size="sm">View Messages</Button>
                </CardContent>
              </Card>

              {/* Progress Tracking */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/progress'}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Progress</h3>
                  <p className="text-gray-600 text-sm mb-4">Track your learning milestones</p>
                  <Button className="w-full" variant="outline" size="sm">View Progress</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Instructors Section */}
      <DynamicInstructorSection />

      {/* Join Platform CTA */}
      <JoinPlatformCTA />

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600">Hear from thousands of successful drivers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Emily Johnson",
                location: "City Centre",

                text: "Sarah was an amazing instructor! I passed my test on the first try thanks to her patient teaching and excellent preparation."
              },
              {
                name: "Michael Chen",
                location: "North Region",
                text: "The intensive course was perfect for me. James helped me gain confidence quickly and I felt fully prepared for my test."
              },
              {
                name: "Lucy Williams",
                location: "Central Region",
                text: "As a nervous driver, Emma made me feel comfortable from day one. Her teaching style is perfect for anxious learners."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">

                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Start Your Driving Journey Today</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Don't wait any longer. Get behind the wheel with the UK's most trusted driving school.
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>No upfront payment required</span>
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>Cancel anytime</span>
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>100% satisfaction guarantee</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-6"
              onClick={() => {
                const coursesSection = document.getElementById('courses');
                if (coursesSection) {
                  coursesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Lessons
            </Button>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-lg px-8 py-6 transform hover:scale-105 transition-all duration-200"
              onClick={() => {
                window.location.href = '/theory';
              }}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Test Your Skills
            </Button>
          </div>
        </div>
      </section>

      {/* Modals and Widgets */}
      <CourseModal
        course={selectedCourse}
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onBookNow={handleBookCourse}
        onMaybeLater={handleMaybeLater}
      />

      <ExitIntentPopup
        isOpen={isExitIntentPopupOpen}
        onClose={() => setIsExitIntentPopupOpen(false)}
        onSubmit={handleExitIntentSubmit}
      />

      <WhatsAppWidget 
        showOnExitIntent={showWhatsAppOnExit}
        onExitIntentShow={() => setShowWhatsAppOnExit(false)}
      />

      <StudentAuthModal
        isOpen={isStudentAuthModalOpen}
        onClose={() => {
          setIsStudentAuthModalOpen(false);
          setPendingCourse(null);
        }}
        onSuccess={pendingCourse ? handleStudentAuthSuccess : handleBookLessonsSuccess}
        courseName={pendingCourse?.course.title}
      />

      <CustomCourseModal
        isOpen={isCustomCourseModalOpen}
        onClose={() => setIsCustomCourseModalOpen(false)}
        onBookCustomCourse={handleBookCustomCourse}
      />

      <CoursePurchaseCounter />
      <ScrollToTop />
      
      {/* Footer */}
      <Footer />

    </main>
  );
}