'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Users, 
  GraduationCap, 
  MessageCircle,
  Phone,
  ArrowRight,
  User,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { name: 'Home', href: '/', icon: Home, action: () => scrollToSection('hero') },
    { name: 'Courses', href: '/#courses', icon: BookOpen, action: () => scrollToSection('courses') },
    { name: 'Instructors', href: '/#instructors', icon: Users, action: () => scrollToSection('instructors') },
    { name: 'Theory Test', href: '/theory', icon: GraduationCap },
    { name: 'Contact', href: '#contact', icon: MessageCircle, action: () => scrollToSection('contact') },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-slate-700/50' 
          : 'bg-slate-900/80 backdrop-blur-sm'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  DriveUK
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.action || (() => window.location.href = item.href)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    pathname === item.href || (item.href.includes('#') && pathname === '/')
                      ? 'bg-gradient-to-r from-blue-500/30 to-green-500/30 text-blue-300 border border-blue-400/60 shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-green-500/20 hover:border hover:border-blue-400/40'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-green-500/20 hover:border hover:border-blue-400/40"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  size="sm"
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg font-medium"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-20 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700 shadow-2xl">
            <div className="px-4 py-6 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.action || (() => {
                    window.location.href = item.href;
                    setIsMobileMenuOpen(false);
                  })}
                  className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-lg text-left transition-all duration-300 hover:scale-[1.02] ${
                    pathname === item.href || (item.href.includes('#') && pathname === '/')
                      ? 'bg-gradient-to-r from-blue-500/30 to-green-500/30 text-blue-300 border border-blue-400/60 shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-green-500/20 hover:border hover:border-blue-400/40'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 space-y-3 border-t border-slate-700">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start py-3.5 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] border-slate-600 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-green-500/20 hover:text-white text-gray-300" 
                    size="lg"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl" 
                    size="lg"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-20"></div>
    </>
  );
}