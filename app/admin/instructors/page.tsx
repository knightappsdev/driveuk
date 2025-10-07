'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, UserPlus } from 'lucide-react';
import { Instructor } from './types';
import { 
  fetchInstructors, 
  deleteInstructor, 
  approveInstructor,
  filterInstructors 
} from './utils';
import StatsCards from './StatsCards';
import SearchFilters from './SearchFilters';
import InstructorsTable from './InstructorsTable';
import InstructorDetailsModal from '@/components/admin/instructors/instructor-details-modal';
import InstructorEditModal from '@/components/admin/instructors/instructor-edit-modal';
import InstructorCreateModal from '@/components/admin/instructors/instructor-create-modal';

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    setLoading(true);
    const data = await fetchInstructors();
    setInstructors(data);
    setLoading(false);
  };

  const filteredInstructors = filterInstructors(instructors, searchTerm, selectedStatus);

  const handleDeleteInstructor = async (instructorId: number) => {
    try {
      await deleteInstructor(instructorId);
      await loadInstructors();
      // Show success message if needed
    } catch (error) {
      console.error('Failed to delete instructor:', error);
      // You could add a toast notification here
    }
  };

  const handleApproveInstructor = async (instructorId: number) => {
    try {
      await approveInstructor(instructorId);
      await loadInstructors();
      // Show success message if needed
    } catch (error) {
      console.error('Failed to approve instructor:', error);
      // You could add a toast notification here
    }
  };

  const handleViewDetails = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsDetailsModalOpen(true);
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsEditModalOpen(true);
  };

  const handleInstructorCreated = () => {
    loadInstructors();
  };

  const handleInstructorUpdated = () => {
    loadInstructors();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Instructors Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage instructor accounts, profiles, and approvals
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Instructors Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage instructor accounts, profiles, and approvals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={loadInstructors}
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
            <UserPlus className="h-4 w-4" />
            Add Instructor
          </Button>
        </div>
      </div>

      <StatsCards instructors={instructors} />

      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <InstructorsTable
        instructors={filteredInstructors}
        onViewDetails={handleViewDetails}
        onEditInstructor={handleEditInstructor}
        onDeleteInstructor={handleDeleteInstructor}
        onApproveInstructor={handleApproveInstructor}
      />

      <InstructorCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onInstructorCreated={handleInstructorCreated}
      />

      <InstructorEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onInstructorUpdated={handleInstructorUpdated}
        instructor={selectedInstructor}
      />

      <InstructorDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        instructor={selectedInstructor}
      />
    </div>
  );
}
