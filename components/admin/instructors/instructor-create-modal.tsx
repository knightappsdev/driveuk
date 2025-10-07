'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, X, Loader2, User, Mail, Phone, MapPin, Award, DollarSign, Car } from 'lucide-react';

interface InstructorCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstructorCreated: () => void;
}

export default function InstructorCreateModal({ isOpen, onClose, onInstructorCreated }: InstructorCreateModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    // ADI Details
    adiBadgeNumber: '',
    adiGrade: 'grade_6' as 'grade_4' | 'grade_5' | 'grade_6' | 'trainee',
    yearsExperience: 1,
    hourlyRate: 45,
    specialties: ['manual'],
    baseCity: '',
    // Optional fields
    instructorSummary: '',
    qualifications: '',
    bio: '',
    availability: '',
    carMake: '',
    carModel: '',
    carType: 'manual' as 'manual' | 'automatic',
    vehicleRegistration: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onInstructorCreated();
        handleClose();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create instructor');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      // ADI Details
      adiBadgeNumber: '',
      adiGrade: 'grade_6' as 'grade_4' | 'grade_5' | 'grade_6' | 'trainee',
      yearsExperience: 1,
      hourlyRate: 45,
      specialties: ['manual'],
      baseCity: '',
      // Optional fields
      instructorSummary: '',
      qualifications: '',
      bio: '',
      availability: '',
      carMake: '',
      carModel: '',
      carType: 'manual' as 'manual' | 'automatic',
      vehicleRegistration: '',
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create New Instructor
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={isSubmitting}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="User's city"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adiBadgeNumber" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />ADI Badge Number *
                </Label>
                <Input
                  id="adiBadgeNumber"
                  value={formData.adiBadgeNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, adiBadgeNumber: e.target.value }))}
                  required
                  placeholder="e.g., ADI123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adiGrade">ADI Grade *</Label>
                <select
                  id="adiGrade"
                  value={formData.adiGrade}
                  onChange={(e) => setFormData(prev => ({ ...prev, adiGrade: e.target.value as 'grade_4' | 'grade_5' | 'grade_6' | 'trainee' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
                  required
                >
                  <option value="grade_6">Grade 6 (Highest)</option>
                  <option value="grade_5">Grade 5</option>
                  <option value="grade_4">Grade 4</option>
                  <option value="trainee">Trainee</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Years Experience *</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />Hourly Rate (£) *
                </Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 45 }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseCity" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />Base City *
                </Label>
                <Input
                  id="baseCity"
                  value={formData.baseCity}
                  onChange={(e) => setFormData(prev => ({ ...prev, baseCity: e.target.value }))}
                  required
                  placeholder="Primary teaching location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carType">Car Type</Label>
                <select
                  id="carType"
                  value={formData.carType}
                  onChange={(e) => setFormData(prev => ({ ...prev, carType: e.target.value as 'manual' | 'automatic' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="carMake" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />Car Make
                </Label>
                <Input
                  id="carMake"
                  value={formData.carMake}
                  onChange={(e) => setFormData(prev => ({ ...prev, carMake: e.target.value }))}
                  placeholder="e.g., Toyota"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carModel" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />Car Model
                </Label>
                <Input
                  id="carModel"
                  value={formData.carModel}
                  onChange={(e) => setFormData(prev => ({ ...prev, carModel: e.target.value }))}
                  placeholder="e.g., Corolla"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleRegistration" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />Vehicle Registration
                </Label>
                <Input
                  id="vehicleRegistration"
                  value={formData.vehicleRegistration}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleRegistration: e.target.value.toUpperCase() }))}
                  placeholder="e.g., AB12 CDE"
                  maxLength={8}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructorSummary">Instructor Summary</Label>
              <textarea
                id="instructorSummary"
                value={formData.instructorSummary}
                onChange={(e) => setFormData(prev => ({ ...prev, instructorSummary: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none dark:bg-gray-800 dark:border-gray-600"
                rows={3}
                placeholder="Brief professional summary..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <textarea
                id="qualifications"
                value={formData.qualifications}
                onChange={(e) => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none dark:bg-gray-800 dark:border-gray-600"
                rows={2}
                placeholder="Professional qualifications and certifications..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none dark:bg-gray-800 dark:border-gray-600"
                rows={3}
                placeholder="Personal bio and teaching approach..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Teaching Specialties</Label>
              <div className="grid grid-cols-2 gap-2">
                {['manual', 'automatic', 'intensive', 'refresher', 'nervous_drivers', 'pass_plus'].map((specialty) => (
                  <label key={specialty} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, specialties: [...prev.specialties, specialty] }));
                        } else {
                          setFormData(prev => ({ ...prev, specialties: prev.specialties.filter(s => s !== specialty) }));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm capitalize">{specialty.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                value={formData.availability}
                onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                placeholder="e.g., Monday-Friday 9AM-5PM"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <><Loader2 className="animate-spin mr-2 h-4 w-4" />Creating...</>
                ) : (
                  <><UserPlus className="mr-2 h-4 w-4" />Create Instructor</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}