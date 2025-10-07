'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Mail, Lock, Phone, UserPlus, LogIn, X, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  courseName?: string;
}

export default function StudentAuthModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  courseName 
}: StudentAuthModalProps) {
  const { login, register, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Sign Up Form State - Matching /register form fields
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    drivingLevel: '',
    licenseNumber: '',
    startDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await login(signInData.email, signInData.password);
      
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setErrors({ general: result.message || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred during sign in' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!signUpData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!signUpData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!signUpData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!signUpData.password) {
      newErrors.password = 'Password is required';
    } else if (signUpData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!signUpData.phone.trim()) {
      newErrors.phone = 'WhatsApp number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(signUpData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!signUpData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!signUpData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!signUpData.drivingLevel) {
      newErrors.drivingLevel = 'Please select your driving level';
    }

    if (!signUpData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'Provisional license number is required';
    }

    if (!signUpData.startDate) {
      newErrors.startDate = 'Please select a start date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        email: signUpData.email,
        password: signUpData.password,
        role: 'student',
        phone: signUpData.phone,
        address: signUpData.address,
        city: signUpData.city,
        drivingLevel: signUpData.drivingLevel,
        licenseNumber: signUpData.licenseNumber,
        startDate: signUpData.startDate
      });
      
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setErrors({ general: result.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred during registration' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSignInData({ email: '', password: '' });
    setSignUpData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      city: '',
      drivingLevel: '',
      licenseNumber: '',
      startDate: ''
    });
    setErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[60vw] max-w-none max-h-[90vh] p-0 overflow-hidden border-0 shadow-2xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* Header with Course Info */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 p-6 text-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {courseName ? `Book "${courseName}"` : 'Book Your Course'}
              </h2>
              <p className="text-blue-100 text-sm">
                Join 200+ students learning to drive with us
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-gray-50 border-b">
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
              activeTab === 'signin'
                ? 'bg-white text-blue-600 shadow-sm border-b-2 border-blue-600 transform scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
            }`}
          >
            <LogIn className="w-4 h-4 inline mr-2" />
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
              activeTab === 'signup'
                ? 'bg-white text-blue-600 shadow-sm border-b-2 border-blue-600 transform scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Create Account
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="relative overflow-hidden">
            {/* Sign In Form */}
            <div className={`transition-all duration-500 transform ${
              activeTab === 'signin' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute top-0 left-0 right-0'
            }`}>
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      className="pl-12 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-300"
                      required
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Your password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      className="pl-12 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-300"
                      required
                    />
                  </div>
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-shake">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {errors.general}
                    </p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg" 
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In & Continue
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Sign Up Form */}
            <div className={`transition-all duration-500 transform ${
              activeTab === 'signup' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute top-0 left-0 right-0'
            }`}>
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-firstName"
                        type="text"
                        placeholder="John"
                        value={signUpData.firstName}
                        onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                        className="pl-10 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-300"
                        required
                      />
                    </div>
                    {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-lastName"
                        type="text"
                        placeholder="Doe"
                        value={signUpData.lastName}
                        onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                        className="pl-10 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-300"
                        required
                      />
                    </div>
                    {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      className="pl-12 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-300"
                      required
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>

              <div className="space-y-2">
                <Label htmlFor="signup-phone" className="text-sm font-medium text-gray-700">WhatsApp Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="+44 7XXX XXXXXX"
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                    className="pl-10 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-300"
                    required
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-address" className="text-sm font-medium text-gray-700">Address</Label>
                <Input
                  id="signup-address"
                  type="text"
                  placeholder="Your full address"
                  value={signUpData.address}
                  onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
                  className="py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-300"
                  required
                />
                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-city" className="text-sm font-medium text-gray-700">City</Label>
                <Input
                  id="signup-city"
                  type="text"
                  placeholder="London"
                  value={signUpData.city}
                  onChange={(e) => setSignUpData({ ...signUpData, city: e.target.value })}
                  className="py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-300"
                  required
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-drivingLevel" className="text-sm font-medium text-gray-700">Driving Level</Label>
                <select
                  id="signup-drivingLevel"
                  value={signUpData.drivingLevel}
                  onChange={(e) => setSignUpData({ ...signUpData, drivingLevel: e.target.value })}
                  className="w-full py-3 px-3 border border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-300"
                  required
                >
                  <option value="">Select driving level</option>
                  <option value="Theory">Theory</option>
                  <option value="Practical">Practical</option>
                </select>
                {errors.drivingLevel && <p className="text-sm text-red-500 mt-1">{errors.drivingLevel}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-licenseNumber" className="text-sm font-medium text-gray-700">Provisional License Number</Label>
                <Input
                  id="signup-licenseNumber"
                  type="text"
                  placeholder="Your provisional license number"
                  value={signUpData.licenseNumber}
                  onChange={(e) => setSignUpData({ ...signUpData, licenseNumber: e.target.value })}
                  className="py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-300"
                  required
                />
                {errors.licenseNumber && <p className="text-sm text-red-500 mt-1">{errors.licenseNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-startDate" className="text-sm font-medium text-gray-700">Start Date</Label>
                <Input
                  id="signup-startDate"
                  type="date"
                  value={signUpData.startDate}
                  onChange={(e) => setSignUpData({ ...signUpData, startDate: e.target.value })}
                  className="py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-300"
                  required
                />
                {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
              </div>                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      className="pl-10 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-300"
                      required
                    />
                  </div>
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      className="pl-10 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-300"
                      required
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-shake">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {errors.general}
                    </p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg" 
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Account & Continue
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center border-t">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}