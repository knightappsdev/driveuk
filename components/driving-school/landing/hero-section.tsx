'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TypewriterText from '@/components/ui/typewriter-text';
import DrivingAnimation from './driving-animation';
import { Play, Star, Users, MapPin, Clock, CheckCircle, Calendar, MessageCircle, Award, Shield, Zap, TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  onBookLessons: () => void;
  onFreeConsultation: () => void;
}

export default function HeroSection({ onBookLessons, onFreeConsultation }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [particlePositions, setParticlePositions] = useState<Array<{top: number, left: number, delay: number, duration: number}>>([]);

  // Trigger animations on mount
  useEffect(() => {
    setIsClient(true);
    setIsVisible(true);
    const timer = setTimeout(() => setStatsAnimated(true), 1000);
    
    // Generate random positions on client side only
    const positions = Array.from({ length: 6 }, (_, i) => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: i * 0.5,
      duration: 3 + Math.random() * 2
    }));
    setParticlePositions(positions);
    
    return () => clearTimeout(timer);
  }, []);

  // Cycle through featured stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const animatedStats = [
    { number: '10K+', label: 'Happy Students', color: 'text-blue-600' },
    { number: '500+', label: 'Expert Instructors', color: 'text-green-600' },
    { number: '98%', label: 'Pass Rate', color: 'text-purple-600' }
  ];

  const CountUp = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (!statsAnimated) return;
      
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [statsAnimated, end, duration]);
    
    return <span>{count}</span>;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-green-600/5 animate-gradient-shift"></div>
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 right-20 w-16 h-16 border-2 border-blue-300/30 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-40 right-1/4 w-12 h-12 border-2 border-green-300/40 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 left-10 w-8 h-8 bg-purple-300/20 transform rotate-12 animate-bounce-slow"></div>
        
        {/* Animated Particles */}
        {isClient && particlePositions.map((position, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float`}
            style={{
              top: `${position.top}%`,
              left: `${position.left}%`,
              animationDelay: `${position.delay}s`,
              animationDuration: `${position.duration}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse-glow">
                <CheckCircle className="w-4 h-4 animate-spin-slow" />
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-bold">
                  UK's Most Trusted Driving School
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <TypewriterText 
                  text="Learn to Drive with Expert Instructors"
                  speed={80}
                  delay={500}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"
                />
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Professional driving lessons across the UK. Find qualified instructors, 
                book your perfect course, and start your driving journey today with confidence.
              </p>
            </div>

            {/* Enhanced Animated Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className={`text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg border border-blue-200/50 transform transition-all duration-500 hover:scale-105 hover:shadow-xl ${statsAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <CountUp end={10000} />
                  <span className="text-2xl">+</span>
                </div>
                <div className="text-sm text-gray-600 font-medium">Happy Students</div>
                <div className="w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2 animate-pulse"></div>
              </div>
              <div className={`text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg border border-green-200/50 transform transition-all duration-500 hover:scale-105 hover:shadow-xl ${statsAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{transitionDelay: '200ms'}}>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  <CountUp end={500} />
                  <span className="text-2xl">+</span>
                </div>
                <div className="text-sm text-gray-600 font-medium">Expert Instructors</div>
                <div className="w-full h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mt-2 animate-pulse"></div>
              </div>
              <div className={`text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg border border-purple-200/50 transform transition-all duration-500 hover:scale-105 hover:shadow-xl ${statsAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{transitionDelay: '400ms'}}>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  <CountUp end={98} />
                  <span className="text-2xl">%</span>
                </div>
                <div className="text-sm text-gray-600 font-medium">Pass Rate</div>
                <div className="w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onBookLessons}
                size="lg"
                className="group relative text-lg px-8 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border-0 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Calendar className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Book Lessons Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Button>
              <Button 
                onClick={onFreeConsultation}
                variant="outline"
                size="lg"
                className="group relative text-lg px-8 py-6 border-2 border-blue-300 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-green-100/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <span className="relative z-10 text-blue-700 group-hover:text-blue-800">Free Consultation</span>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium">4.9/5 from 2,500+ reviews</span>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced Driving Animation */}
          <div className={`relative h-full flex items-center transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-100 via-white to-green-100 border-0 shadow-2xl w-full hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-transparent to-green-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="h-96 relative">
                <DrivingAnimation />
              </div>
              {/* Enhanced Glow Effect */}
              <div className="absolute inset-0 rounded-lg shadow-inner opacity-50"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
            </Card>

            {/* Enhanced Floating Elements */}
            <div className="absolute -top-6 -left-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 animate-float border border-green-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-110">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-inner">
                  <Users className="w-6 h-6 text-green-600 animate-pulse" />
                </div>
                <div>
                  <div className="font-bold text-sm bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">500+ Instructors</div>
                  <div className="text-xs text-gray-600 font-medium flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Available Now
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 animate-float animation-delay-2000 border border-blue-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-110">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-inner">
                  <Clock className="w-6 h-6 text-blue-600 animate-spin-slow" />
                </div>
                <div>
                  <div className="font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Flexible Hours</div>
                  <div className="text-xs text-gray-600 font-medium">7 Days a Week</div>
                </div>
              </div>
            </div>
            
            {/* Additional Achievement Badges */}
            <div className="absolute top-1/2 -left-8 bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-sm rounded-xl shadow-lg p-3 animate-float animation-delay-1000 border border-purple-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xs font-bold text-purple-700">Top Rated</div>
              </div>
            </div>
            
            <div className="absolute top-1/4 -right-8 bg-gradient-to-r from-yellow-50 to-orange-50 backdrop-blur-sm rounded-xl shadow-lg p-3 animate-float animation-delay-3000 border border-yellow-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="text-xs font-bold text-yellow-700">Safe & Secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes text-gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        .animate-text-gradient {
          background-size: 200% 200%;
          animation: text-gradient 3s ease-in-out infinite;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes gradient-shift {
          0% { background: linear-gradient(45deg, rgba(59, 130, 246, 0.05), transparent, rgba(34, 197, 94, 0.05)); }
          33% { background: linear-gradient(45deg, rgba(34, 197, 94, 0.05), rgba(147, 51, 234, 0.03), rgba(59, 130, 246, 0.05)); }
          66% { background: linear-gradient(45deg, rgba(147, 51, 234, 0.05), rgba(59, 130, 246, 0.03), rgba(34, 197, 94, 0.05)); }
          100% { background: linear-gradient(45deg, rgba(59, 130, 246, 0.05), transparent, rgba(34, 197, 94, 0.05)); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(12deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.6), 0 0 30px rgba(59, 130, 246, 0.3); }
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 8s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        
        /* Backdrop blur support */
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
        
        /* Advanced gradient text */
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style>
    </section>
  );
}