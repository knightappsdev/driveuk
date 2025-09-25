'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, X, Loader2, BookOpen, Clock, DollarSign, Star, Award, Plus, Minus } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  level: 'absolute-beginner' | 'beginner' | 'intermediate' | 'advanced';
  totalHours: number;
  price: string;
  features: string[];
  color: string;
  isRecommended: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  studentCount: number;
}

interface CourseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseUpdated: () => void;
  course: Course | null;
}

export default function CourseEditModal({ isOpen, onClose, onCourseUpdated, course }: CourseEditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'beginner' as 'absolute-beginner' | 'beginner' | 'intermediate' | 'advanced',
    totalHours: 10,
    price: '',
    features: [''],
    color: 'blue',
    isRecommended: false,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        level: course.level,
        totalHours: course.totalHours,
        price: course.price,
        features: course.features.length > 0 ? course.features : [''],
        color: course.color,
        isRecommended: course.isRecommended,
        isActive: course.isActive,
      });
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          level: formData.level,
          totalHours: formData.totalHours,
          price: parseFloat(formData.price),
          features: formData.features.filter(f => f.trim() !== ''),
          color: formData.color,
          isRecommended: formData.isRecommended,
          isActive: formData.isActive,
        }),
      });

      if (response.ok) {
        onCourseUpdated();
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update course');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      features: prev.features.filter((_, i) => i !== index) 
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      features: prev.features.map((f, i) => i === index ? value : f) 
    }));
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Course
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
                <Label htmlFor="title" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />Level *
                </Label>
                <select
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                  required
                >
                  <option value="absolute-beginner">Absolute Beginner</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalHours" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />Total Hours *
                </Label>
                <Input
                  id="totalHours"
                  type="number"
                  min="1"
                  max="200"
                  value={formData.totalHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalHours: parseInt(e.target.value) || 10 }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />Price (£) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color Theme</Label>
                <select
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                rows={3}
                required
              />
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label>Course Features *</Label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1"
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Feature
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRecommended"
                  checked={formData.isRecommended}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRecommended: e.target.checked }))}
                />
                <Label htmlFor="isRecommended" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Recommended Course
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                />
                <Label htmlFor="isActive">Active Course</Label>
              </div>
            </div>

            {/* Course Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Current Enrollment:</strong> {course.studentCount} students
              </p>
              <p className="text-blue-600 dark:text-blue-300">
                <strong>Course ID:</strong> #{course.id}
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
                  <><Edit className="mr-2 h-4 w-4" />Update Course</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}