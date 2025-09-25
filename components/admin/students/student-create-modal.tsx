'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, X, Loader2, User, Mail, Phone, Lock, MapPin, Calendar, Shield, Heart } from 'lucide-react';

interface StudentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentCreated: () => void;
}

export default function StudentCreateModal({ isOpen, onClose, onStudentCreated }: StudentCreateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    licenseStatus: 'none' as 'none' | 'provisional' | 'full',
    medicalConditions: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          address: formData.address || undefined,
          emergencyContact: formData.emergencyContact || undefined,
          licenseStatus: formData.licenseStatus,
          medicalConditions: formData.medicalConditions || undefined,
        }),
      });

      if (response.ok) {
        onStudentCreated();
        handleClose();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create student');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      emergencyContact: '',
      licenseStatus: 'none',
      medicalConditions: '',
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
            Create New Student
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
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
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
                  placeholder="Phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />Emergency Contact
                </Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  placeholder="Emergency contact number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />Address
              </Label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                rows={2}
                placeholder="Full address..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseStatus" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />License Status
              </Label>
              <select
                id="licenseStatus"
                value={formData.licenseStatus}
                onChange={(e) => setFormData(prev => ({ ...prev, licenseStatus: e.target.value as 'none' | 'provisional' | 'full' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="none">No License</option>
                <option value="provisional">Provisional License</option>
                <option value="full">Full License</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalConditions" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />Medical Conditions
              </Label>
              <textarea
                id="medicalConditions"
                value={formData.medicalConditions}
                onChange={(e) => setFormData(prev => ({ ...prev, medicalConditions: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                rows={2}
                placeholder="Any medical conditions that may affect driving (optional)..."
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
                  <><UserPlus className="mr-2 h-4 w-4" />Create Student</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}