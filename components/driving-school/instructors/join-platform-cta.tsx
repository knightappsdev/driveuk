'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  Crown, 
  TrendingUp, 
  Users, 
  Calendar, 
  MapPin, 
  Star,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function JoinPlatformCTA() {
  const [memberCount, setMemberCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const targetCount = 500;

  useEffect(() => {
    setIsVisible(true);
    let current = 0;
    const increment = 20;
    const duration = 2500; // 2.5 seconds
    const stepTime = duration / (targetCount / increment);

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setMemberCount(targetCount);
        clearInterval(timer);
      } else {
        setMemberCount(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full py-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className={`max-w-7xl mx-auto transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-green-500/20 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Premium Instructor Platform</span>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>

            <h2 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent leading-tight">
              Join Our Platform
            </h2>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your driving instruction career with the UK's most innovative platform. 
              <span className="text-white font-semibold"> Connect, Teach, Earn More.</span>
            </p>

            {/* Stats Counter */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-400" />
                <span className="text-gray-300 text-lg">Our Members so far:</span>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-2xl font-bold text-3xl lg:text-4xl shadow-2xl transform hover:scale-105 transition-transform">
                {memberCount.toLocaleString()}+
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-16">
              <div className="w-full bg-white/10 rounded-full h-2 mb-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-2000 ease-out shadow-lg"
                  style={{ width: `${(memberCount / targetCount) * 100}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-sm">
                Growing community across England, Scotland, Wales & Northern Ireland
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Earning Potential */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Maximize Earnings</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Set your own rates, manage your schedule, and access premium students who value quality instruction.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">£25-£60 per hour potential</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Flexible scheduling</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Direct payments</span>
                </div>
              </div>
            </div>

            {/* Student Connection */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Find Local Students</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Advanced matching system connects you with students in your area who need your expertise.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Location-based matching</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Student preferences</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Instant notifications</span>
                </div>
              </div>
            </div>

            {/* Professional Tools */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Professional Suite</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Complete business management tools designed specifically for driving instructors.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Booking management</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Progress tracking</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Payment processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-yellow-400 mb-4">
              <Star className="w-5 h-5" />
              <span className="font-medium">Trusted by 500+ UK Instructors</span>
              <Star className="w-5 h-5" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 hover:from-blue-600 hover:via-purple-600 hover:to-green-600 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group rounded-2xl"
                >
                  <UserPlus className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  Join Now - It's Free
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Start earning immediately</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}