'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(result.message);
        if (result.redirectTo) {
          router.push(result.redirectTo);
        } else {
          router.push('/dashboard');
        }
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setMessage(result.message);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: [] }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl xl:w-3/5 2xl:w-3/5">
        <div className="space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back to DriveUK
          </p>
        </div>

        <Card className="p-8">
          {/* Demo Login Credentials */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
              🚀 Demo Login Credentials
            </h3>
            <p className="text-xs text-blue-600 mb-4">Try the platform with these pre-configured accounts:</p>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Admin Account */}
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xs font-semibold text-gray-800 flex items-center">
                      👤 Admin Account
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Full platform management access
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-xs px-3 py-1 h-auto border-purple-200 text-purple-700 hover:bg-purple-50"
                    onClick={() => {
                      setFormData({ email: 'admin@driveuk.com', password: 'Admin123!' });
                    }}
                  >
                    Use Admin
                  </Button>
                </div>
                <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                  admin@driveuk.com / Admin123!
                </div>
              </div>

              {/* Instructor Account */}
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xs font-semibold text-gray-800 flex items-center">
                      🏫 Instructor Account
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Student management & scheduling
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-xs px-3 py-1 h-auto border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => {
                      setFormData({ email: 'instructor@driveuk.com', password: 'Instructor123!' });
                    }}
                  >
                    Use Instructor
                  </Button>
                </div>
                <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                  instructor@driveuk.com / Instructor123!
                </div>
              </div>

              {/* Student Account */}
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xs font-semibold text-gray-800 flex items-center">
                      🎓 Student Account
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Learning progress & lesson booking
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-xs px-3 py-1 h-auto border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => {
                      setFormData({ email: 'student@driveuk.com', password: 'Student123!' });
                    }}
                  >
                    Use Student
                  </Button>
                </div>
                <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                  student@driveuk.com / Student123!
                </div>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-700 border border-yellow-200">
              💡 <strong>Note:</strong> These demo accounts come pre-populated with sample data to showcase all platform features.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className={`p-4 rounded-md ${
                message.includes('success') || message.includes('Login successful')
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                {message}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john.smith@example.com"
                required
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password[0]}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <Link 
                href="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Create one here
              </Link>
            </p>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}