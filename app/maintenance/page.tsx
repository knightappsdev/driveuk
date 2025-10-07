'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Mail, 
  Phone, 
  Twitter, 
  Facebook, 
  Instagram 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function MaintenancePage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Content */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12 text-center">
            {/* Icon and Animation */}
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <Settings className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Main Message */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                We'll Be Right Back!
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Our website is currently undergoing scheduled maintenance to improve your experience.
              </p>
            </div>

            {/* Status Information */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Maintenance Status</h3>
                <p className="text-sm text-gray-600">
                  System updates in progress
                </p>
                <div className="mt-3 bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <RefreshCw className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Current Time</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {currentTime.toLocaleDateString('en-GB')}
                </p>
                <p className="font-mono text-lg text-green-600">
                  {currentTime.toLocaleTimeString('en-GB')}
                </p>
              </div>
            </div>

            {/* What's Happening */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">What's Happening?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Database optimization
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Security updates
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Performance improvements
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mb-8">
              <Button 
                onClick={handleRefresh}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Again
              </Button>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-8">
              <h3 className="font-semibold text-gray-900 mb-4">Need Immediate Assistance?</h3>
              <div className="flex justify-center space-x-6 mb-6">
                <a 
                  href="mailto:support@driveuk.com" 
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  support@driveuk.com
                </a>
                <a 
                  href="tel:+442012345678" 
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +44 20 1234 5678
                </a>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-4">
                <a href="#" className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <Twitter className="w-4 h-4 text-blue-600" />
                </a>
                <a href="#" className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <Facebook className="w-4 h-4 text-blue-600" />
                </a>
                <a href="#" className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <Instagram className="w-4 h-4 text-blue-600" />
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-sm text-gray-500">
              <p>DriveUK Driving School</p>
              <p>Professional driving lessons across the UK</p>
            </div>
          </CardContent>
        </Card>

        {/* Background Animation */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}