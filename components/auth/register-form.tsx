'use client';

import { useState } from 'react';
import StudentRegistrationCard from './student';
import InstructorRegistrationCard from './instructor';

export default function RegisterForm() {
  const [selectedType, setSelectedType] = useState<'student' | 'instructor' | null>(null);

  if (selectedType === 'student') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 py-12 px-4">
        <div className="w-full mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={() => setSelectedType(null)}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              ← Back to selection
            </button>
          </div>
          <StudentRegistrationCard />
        </div>
      </div>
    );
  }

  if (selectedType === 'instructor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 py-12 px-4">
        <div className="w-full mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={() => setSelectedType(null)}
              className="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              ← Back to selection
            </button>
          </div>
          <InstructorRegistrationCard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Join DriveSchool Pro
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your registration type to get started with the UK's leading driving education platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Student Registration Card */}
          <div 
            onClick={() => setSelectedType('student')}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl shadow-lg border-2 border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3">
                  Register as a Student
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  Start your driving journey with professional guidance and structured learning
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Perfect for you if:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Learning to drive for the first time</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Need professional instruction</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Want flexible lesson scheduling</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Preparing for your driving test</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white/70 rounded-lg border border-blue-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Get started with</p>
                  <p className="font-semibold text-blue-600">✓ Free theory materials  ✓ Instructor matching  ✓ Progress tracking</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-2 text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                  <span>Get Started</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor Registration Card */}
          <div 
            onClick={() => setSelectedType('instructor')}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl shadow-lg border-2 border-green-100 hover:border-green-300 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
                  Register as an Instructor
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  Share your expertise and build your driving instruction business
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Perfect for you if:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Qualified driving instructor (ADI)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Want to grow your student base</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Need better scheduling tools</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Ready to increase your income</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white/70 rounded-lg border border-green-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Get started with</p>
                  <p className="font-semibold text-green-600">✓ Student matching  ✓ Schedule management  ✓ Payment processing</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-2 text-green-600 font-medium group-hover:text-green-800 transition-colors">
                  <span>Get Started</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Already have an account? 
            <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium ml-1">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}