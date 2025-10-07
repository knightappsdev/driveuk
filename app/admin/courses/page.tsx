'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus, Eye } from 'lucide-react';
import { Course } from './types';
import { 
  fetchCourses, 
  deleteCourse, 
  toggleRecommended,
  toggleActive,
  filterCourses 
} from './utils';
import StatsCards from './StatsCards';
import SearchFilters from './SearchFilters';
import CoursesTable from './CoursesTable';
import CourseDetailsModal from '@/components/admin/courses/course-details-modal';
import CourseEditModal from '@/components/admin/courses/course-edit-modal';
import CourseCreateModal from '@/components/admin/courses/course-create-modal';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const data = await fetchCourses();
    setCourses(data);
    setLoading(false);
  };

  const filteredCourses = filterCourses(courses, searchTerm, selectedLevel, selectedStatus);

  const handleDeleteCourse = async (courseId: number) => {
    const success = await deleteCourse(courseId);
    if (success) {
      await loadCourses();
    }
  };

  const handleToggleRecommended = async (courseId: number, isRecommended: boolean) => {
    const success = await toggleRecommended(courseId, isRecommended);
    if (success) {
      await loadCourses();
    }
  };

  const handleToggleActive = async (courseId: number, isActive: boolean) => {
    const success = await toggleActive(courseId, isActive);
    if (success) {
      await loadCourses();
    }
  };

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setIsDetailsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleCourseCreated = () => {
    loadCourses();
  };

  const handleCourseUpdated = () => {
    loadCourses();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage driving courses and curriculum
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage driving courses and curriculum
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Public Site
          </Button>
          <Button 
            variant="outline" 
            onClick={loadCourses}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>
      </div>

      <StatsCards courses={courses} />

      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <CoursesTable
        courses={filteredCourses}
        onViewDetails={handleViewDetails}
        onEditCourse={handleEditCourse}
        onDeleteCourse={handleDeleteCourse}
        onToggleRecommended={handleToggleRecommended}
        onToggleActive={handleToggleActive}
      />

      <CourseCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCourseCreated={handleCourseCreated}
      />

      <CourseEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onCourseUpdated={handleCourseUpdated}
        course={selectedCourse}
      />

      <CourseDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
}
