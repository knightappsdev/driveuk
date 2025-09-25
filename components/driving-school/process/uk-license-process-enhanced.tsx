'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  BookOpen, 
  CheckCircle, 
  Calendar, 
  Car, 
  Award,
  ArrowRight,
  ExternalLink,
  Phone,
  Play,
  Timer,
  Target,
  TrendingUp,
  Zap,
  Star,
  Users,
  Clock
} from 'lucide-react';

interface ProcessStep {
  id: number;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  hoverInfo: string;
  timeEstimate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  actionButton?: {
    text: string;
    action: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
}

export default function UKLicenseProcessEnhanced() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Auto-progress through steps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => prev < 6 ? prev + 1 : 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  
  // Initial animation trigger
  useEffect(() => {
    setIsVisible(true);
    // Gradually reveal steps
    processSteps.forEach((_, index) => {
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, index + 1]);
      }, (index + 1) * 200);
    });
  }, []);
  
  // Progress calculation based on visible steps
  useEffect(() => {
    const newProgress = (visibleSteps.length / 6) * 100;
    setProgress(newProgress);
  }, [visibleSteps]);

  const processSteps: ProcessStep[] = [
    {
      id: 1,
      title: "Apply for a DVLA Provisional License",
      icon: FileText,
      description: "Get your provisional driving license to start learning",
      hoverInfo: "You can apply online at gov.uk or by post. You must be at least 17 years old (16 for moped). You'll need proof of identity and address. The license costs £34 online or £43 by post.",
      timeEstimate: "1-2 weeks",
      difficulty: "Easy",
      actionButton: {
        text: "Apply via DVLA",
        action: () => window.open('https://www.gov.uk/apply-first-provisional-driving-licence', '_blank'),
        variant: 'default'
      }
    },
    {
      id: 2,
      title: "Start your theory lessons",
      icon: BookOpen,
      description: "Learn the Highway Code and traffic rules",
      hoverInfo: "Study the Highway Code, road signs, and traffic laws. Use official DVSA apps and practice tests. We recommend at least 20 hours of theory study. You can study independently or take our theory courses.",
      timeEstimate: "2-4 weeks",
      difficulty: "Medium",
      actionButton: {
        text: "Book Theory Course",
        action: () => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'outline'
      }
    },
    {
      id: 3,
      title: "Prepare and pass your theory test",
      icon: CheckCircle,
      description: "Take the official DVSA theory test",
      hoverInfo: "The theory test has 50 multiple choice questions (pass mark: 43/50) plus a hazard perception test (pass mark: 44/75). The test costs £23 and you'll get your results immediately.",
      timeEstimate: "1 day",
      difficulty: "Medium",
      actionButton: {
        text: "Book Theory Test",
        action: () => window.open('https://www.gov.uk/book-theory-test', '_blank'),
        variant: 'default'
      }
    },
    {
      id: 4,
      title: "Book for your practical test",
      icon: Calendar,
      description: "Schedule your practical driving test",
      hoverInfo: "You can only book your practical test after passing your theory test. The practical test costs £62 (£75 evenings/weekends). Book early as waiting times can be several weeks.",
      timeEstimate: "Varies",
      difficulty: "Easy",
      actionButton: {
        text: "Book Practical Test",
        action: () => window.open('https://www.gov.uk/book-practical-driving-test', '_blank'),
        variant: 'default'
      }
    },
    {
      id: 5,
      title: "Start your practical classes",
      icon: Car,
      description: "Learn to drive with professional instructors",
      hoverInfo: "The average learner needs 40-50 hours of professional lessons plus 20+ hours of private practice. We offer flexible scheduling, expert instructors, and modern dual-control cars for your safety.",
      timeEstimate: "8-12 weeks",
      difficulty: "Hard",
      actionButton: {
        text: "Book Lessons",
        action: () => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'outline'
      }
    },
    {
      id: 6,
      title: "Pass your practical test",
      icon: Award,
      description: "Get your full UK driving license",
      hoverInfo: "The practical test lasts about 40 minutes including independent driving and possibly a manoeuvre. Pass rate is around 45%. If you pass, you'll get your full license within 3 weeks!",
      timeEstimate: "1 day",
      difficulty: "Hard",
      actionButton: {
        text: "Contact Us",
        action: () => {
          const message = `Hi! I'd like information about preparing for my practical driving test and booking lessons.`;
          const encodedMessage = encodeURIComponent(message);
          window.open(`https://wa.me/447756183484?text=${encodedMessage}`, '_blank');
        },
        variant: 'secondary'
      }
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300/20 rounded-full animate-float" style={{animationDelay: '0s'}} />
        <div className="absolute bottom-40 right-20 w-24 h-24 bg-green-300/20 rounded-full animate-float" style={{animationDelay: '2s'}} />
        <div className="absolute top-60 right-40 w-16 h-16 bg-purple-300/20 rounded-full animate-float" style={{animationDelay: '4s'}} />
        
        {/* Progress Lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-6xl px-4">
            <svg className="w-full h-32" viewBox="0 0 1200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M50 50 Q 300 20, 400 50 T 700 50 Q 900 80, 1150 50" 
                stroke="url(#gradient)" 
                strokeWidth="3" 
                fill="none"
                strokeDasharray="10,5"
                className="animate-pulse"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 0.6}} />
                  <stop offset="50%" style={{stopColor: '#8B5CF6', stopOpacity: 0.8}} />
                  <stop offset="100%" style={{stopColor: '#10B981', stopOpacity: 0.6}} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-green-100 px-6 py-3 rounded-full mb-6 animate-pulse-glow">
            <Target className="w-5 h-5 text-blue-600 animate-spin-slow" />
            <span className="text-blue-800 font-semibold">Complete Step-by-Step Guide</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            UK Driver's License Process Simplified
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Follow our interactive step-by-step guide to get your full UK driving license. 
            We'll support you through every stage of your driving journey.
          </p>
          
          {/* Interactive Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Your Progress Journey</span>
              <span className="font-semibold">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full animate-shimmer" />
              </div>
            </div>
            <div className="flex justify-between mt-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      visibleSteps.includes(i + 1) 
                        ? 'bg-gradient-to-r from-blue-500 to-green-500 scale-150 shadow-lg' 
                        : 'bg-gray-300'
                    } ${
                      currentStep === i + 1 ? 'animate-pulse ring-4 ring-blue-300/50' : ''
                    }`}
                  />
                  <span className={`text-xs mt-1 font-medium transition-colors duration-300 ${
                    currentStep === i + 1 ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    Step {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Current Step Highlight */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <Play className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-blue-600 font-medium">Currently highlighting: Step {currentStep}</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const isHovered = hoveredCard === step.id;
            const isVisible = visibleSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            
            return (
              <Card
                key={step.id}
                className={`relative overflow-hidden transition-all duration-700 cursor-pointer group transform ${
                  isVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                } ${
                  isCurrent
                    ? 'scale-105 shadow-2xl ring-4 ring-blue-500/30 ring-offset-2 bg-gradient-to-br from-blue-50/50 to-green-50/50'
                    : ''
                } ${
                  isHovered 
                    ? 'scale-105 shadow-2xl ring-2 ring-purple-500/20' 
                    : 'hover:scale-102 shadow-lg'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`
                }}
                onMouseEnter={() => setHoveredCard(step.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Enhanced Card Number Badge */}
                <div className={`absolute -top-4 -left-4 w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-xl z-10 transition-all duration-500 ${
                  isCurrent ? 'animate-pulse scale-110' : ''
                } ${
                  isVisible ? 'animate-bounce-once' : ''
                }`}>
                  <div className="relative">
                    {step.id}
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                    )}
                  </div>
                </div>
                
                {/* Step Status Indicator */}
                {isVisible && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-scale-in z-10">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Difficulty Badge */}
                <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(step.difficulty)} z-10`}>
                  {step.difficulty}
                </div>

                {/* Enhanced Background Gradient */}
                <div className={`absolute inset-0 transition-all duration-500 ${
                  isCurrent
                    ? 'bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-green-600/10 opacity-100'
                    : isHovered 
                      ? 'bg-gradient-to-br from-blue-600/5 to-green-600/5 opacity-100' 
                      : 'opacity-0'
                }`} />
                
                {/* Shimmer Effect for Current Step */}
                {isCurrent && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full animate-shimmer" />
                )}

                <CardContent className="relative z-10 p-6">
                  {/* Enhanced Icon Section */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                      isCurrent
                        ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 text-white scale-125 animate-pulse'
                        : isHovered 
                          ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white scale-110' 
                          : 'bg-gradient-to-br from-blue-100 to-green-100 text-blue-600'
                    }`}>
                      <Icon className={`transition-all duration-500 ${
                        isCurrent || isHovered ? 'w-7 h-7' : 'w-6 h-6'
                      } ${
                        isCurrent ? 'animate-bounce' : ''
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold transition-all duration-300 ${
                        isCurrent
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 text-lg'
                          : isHovered 
                            ? 'text-blue-700' 
                            : 'text-gray-900'
                      }`}>
                        {step.title}
                      </h3>
                      {isCurrent && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 animate-fade-in">
                          <TrendingUp className="w-3 h-3" />
                          <span>Featured Step</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time Estimate */}
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 font-medium">Estimated: {step.timeEstimate}</span>
                  </div>

                  {/* Description */}
                  <p className={`text-sm leading-relaxed mb-6 transition-all duration-300 ${
                    isCurrent
                      ? 'text-gray-800 font-medium text-base'
                      : isHovered 
                        ? 'text-gray-700' 
                        : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>

                  {/* Enhanced Hover Details */}
                  <div className={`transition-all duration-700 overflow-hidden ${
                    isHovered || isCurrent ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
                  }`}>
                    <div className={`p-4 rounded-xl mb-4 border transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 border-blue-200 shadow-inner'
                        : 'bg-gradient-to-r from-blue-50 to-green-50 border-blue-100'
                    }`}>
                      <div className="flex items-start gap-2">
                        <Timer className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {step.hoverInfo}
                        </p>
                      </div>
                      
                      {/* Progress Indicator for Current Step */}
                      {isCurrent && (
                        <div className="mt-3 p-2 bg-white/60 rounded-lg animate-fade-in">
                          <div className="flex items-center gap-2 text-xs text-blue-700">
                            <Zap className="w-3 h-3" />
                            <span className="font-semibold">Currently Featured!</span>
                            <Star className="w-3 h-3 text-yellow-500 animate-pulse" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Action Button */}
                  {step.actionButton && (
                    <div className={`transition-all duration-500 ${
                      isHovered || isCurrent 
                        ? 'transform translate-y-0 opacity-100' 
                        : 'transform translate-y-2 opacity-75'
                    }`}>
                      <Button 
                        onClick={step.actionButton.action}
                        variant={step.actionButton.variant || 'default'}
                        className={`w-full group relative overflow-hidden transition-all duration-500 ${
                          step.actionButton.variant === 'outline' 
                            ? 'border-2 border-blue-300 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50' 
                            : isCurrent
                              ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 shadow-xl'
                              : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'
                        } ${
                          isHovered || isCurrent 
                            ? 'shadow-xl transform scale-105' 
                            : 'shadow-md'
                        } ${
                          isCurrent 
                            ? 'animate-pulse-glow ring-2 ring-blue-300/50' 
                            : ''
                        }`}
                      >
                        {/* Button shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        
                        <span className="relative flex items-center justify-center gap-2">
                          {isCurrent && (
                            <Play className="w-4 h-4 animate-pulse" />
                          )}
                          {step.actionButton.text}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
                        </span>
                      </Button>
                    </div>
                  )}

                  {/* Progress Bar at Bottom */}
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-700 ${
                    isHovered || isCurrent ? 'w-full' : 'w-0'
                  }`} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Call to Action */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-blue-200/50 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Ready to Start Your Driving Journey?
              </h3>
            </div>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Our expert instructors will guide you through every step. Get personalized support and increase your chances of passing first time!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="group bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Car className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Book Your First Lesson
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => {
                  const message = `Hi! I'd like to know more about the UK driving license process and how you can help me get licensed.`;
                  const encodedMessage = encodeURIComponent(message);
                  window.open(`https://wa.me/447756183484?text=${encodedMessage}`, '_blank');
                }}
              >
                <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Get Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes bounce-once {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(16, 185, 129, 0.3); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style>
    </section>
  );
}