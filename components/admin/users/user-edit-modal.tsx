'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Edit, 
  X, 
  Loader2,
  User,
  Mail,
  Phone,
  Image,
  Shield,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  isActive: boolean;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
  user: User | null;
}

interface FormData {
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  phone: string;
  avatar: string;
  isActive: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function UserEditModal({ isOpen, onClose, onUserUpdated, user }: UserEditModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'student',
    phone: '',
    avatar: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        avatar: user.avatar || '',
        isActive: user.isActive,
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.avatar && !/^https?:\/\/.+/.test(formData.avatar)) {
      newErrors.avatar = 'Avatar must be a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          phone: formData.phone || undefined,
          avatar: formData.avatar || undefined,
          isActive: formData.isActive,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onUserUpdated();
        handleClose();
      } else {
        if (data.details) {
          // Handle validation errors from API
          const apiErrors: FormErrors = {};
          data.details.forEach((error: any) => {
            if (error.path && error.path.length > 0) {
              apiErrors[error.path[0]] = error.message;
            }
          });
          setErrors(apiErrors);
        } else {
          setErrors({ general: data.error || 'Failed to update user' });
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit User
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {errors.general}
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                disabled={isSubmitting}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                disabled={isSubmitting}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role *
              </Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value as FormData['role'])}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number (optional)"
                disabled={isSubmitting}
              />
            </div>

            {/* Avatar */}
            <div className="space-y-2">
              <Label htmlFor="avatar" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Avatar URL
              </Label>
              <Input
                id="avatar"
                type="url"
                value={formData.avatar}
                onChange={(e) => handleInputChange('avatar', e.target.value)}
                placeholder="https://example.com/avatar.jpg (optional)"
                disabled={isSubmitting}
                className={errors.avatar ? 'border-red-500' : ''}
              />
              {errors.avatar && (
                <p className="text-red-600 text-sm">{errors.avatar}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                {formData.isActive ? (
                  <ToggleRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ToggleLeft className="h-4 w-4 text-gray-400" />
                )}
                Account Status
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  disabled={isSubmitting}
                  className="rounded"
                />
                <Label htmlFor="isActive" className="text-sm">
                  {formData.isActive ? 'Active' : 'Inactive'}
                </Label>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm">
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Update User
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}