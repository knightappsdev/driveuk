'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, X, Loader2, User, Mail, Phone, MapPin, Calendar, Shield, Heart } from 'lucide-react';

interface Student {
  id: number;
  userId: number;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  licenseStatus: 'none' | 'provisional' | 'full';
  medicalConditions?: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userAvatar?: string;
  userIsActive: boolean;
  userCreatedAt: string;
}

interface StudentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentUpdated: () => void;
  student: Student | null;
}

export default function StudentEditModal({ isOpen, onClose, onStudentUpdated, student }: StudentEditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    licenseStatus: 'none' as 'none' | 'provisional' | 'full',
    medicalConditions: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.userName,
        email: student.userEmail,
        phone: student.userPhone || '',
        dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
        address: student.address || '',
        emergencyContact: student.emergencyContact || '',
        licenseStatus: student.licenseStatus,
        medicalConditions: student.medicalConditions || '',
        isActive: student.userIsActive,
      });
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/students/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          address: formData.address || undefined,
          emergencyContact: formData.emergencyContact || undefined,
          licenseStatus: formData.licenseStatus,
          medicalConditions: formData.medicalConditions || undefined,
          isActive: formData.isActive,
        }),
      });

      if (response.ok) {
        onStudentUpdated();
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update student');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Student
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
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
              <Label htmlFor="medicalConditions" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />Medical Conditions
              </Label>
              <textarea
                id="medicalConditions"
                value={formData.medicalConditions}
                onChange={(e) => setFormData(prev => ({ ...prev, medicalConditions: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                rows={2}
                placeholder="Any medical conditions that may affect driving..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              />
              <Label htmlFor="isActive">Active Account</Label>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm">
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Student ID:</strong> #{student.id}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Created:</strong> {new Date(student.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <><Loader2 className="animate-spin mr-2 h-4 w-4" />Updating...</>
                ) : (
                  <><Edit className="mr-2 h-4 w-4" />Update Student</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}