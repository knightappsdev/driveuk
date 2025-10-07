'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Student } from './types';
import { fetchStudents, filterStudents, deleteStudent, updateStudent, createStudent, getStudent } from './utils';
import SearchFilters from './SearchFilters';
import StatsCards from './StatsCards';
import StudentsTable from './StudentsTable';

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    handleFetchStudents();
  }, []);

  const handleFetchStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents();
      setStudents(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }
    
    const success = await deleteStudent(studentId);
    if (success) {
      alert('Student deleted successfully');
      handleFetchStudents();
    } else {
      alert('Failed to delete student');
    }
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleCreateStudent = () => {
    setShowCreateModal(true);
  };

  const handleSendMessage = (student: Student) => {
    // Navigate to admin messages page with student information in query params
    const params = new URLSearchParams({
      recipient: student.email,
      recipientName: `${student.firstName} ${student.lastName}`,
      recipientRole: 'student',
      recipientId: student.id.toString()
    });
    router.push(`/admin/messages?${params.toString()}`);
  };

  const handleUpdateStudent = async (studentData: Partial<Student>) => {
    if (!selectedStudent) return;
    
    const success = await updateStudent(selectedStudent.id, studentData);
    if (success) {
      alert('Student updated successfully');
      setShowEditModal(false);
      setSelectedStudent(null);
      handleFetchStudents();
    } else {
      alert('Failed to update student');
    }
  };

  const handleCreateNewStudent = async (studentData: Partial<Student>) => {
    const success = await createStudent(studentData);
    if (success) {
      alert('Student created successfully');
      setShowCreateModal(false);
      handleFetchStudents();
    } else {
      alert('Failed to create student');
    }
  };

  const filteredStudents = filterStudents(students, searchTerm, selectedStatus);

  // Simple Modal Component
  const Modal = ({ show, onClose, title, children }: { show: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onRefresh={handleFetchStudents}
        onAddStudent={handleCreateStudent}
        loading={loading}
      />

      <StatsCards students={students} />

      <StudentsTable 
        students={filteredStudents}
        onDeleteStudent={handleDeleteStudent}
        onViewStudent={handleViewStudent}
        onEditStudent={handleEditStudent}
        onSendMessage={handleSendMessage}
      />

      {/* View Student Modal */}
      <Modal 
        show={showViewModal} 
        onClose={() => {setShowViewModal(false); setSelectedStudent(null);}}
        title="Student Details"
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedStudent.firstName} {selectedStudent.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedStudent.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedStudent.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">City</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedStudent.city || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">License Type</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedStudent.licenseType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Status</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedStudent.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Student Modal */}
      <Modal 
        show={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Create New Student"
      >
        <StudentForm 
          onSubmit={handleCreateNewStudent}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Student Modal */}
      <Modal 
        show={showEditModal} 
        onClose={() => {setShowEditModal(false); setSelectedStudent(null);}}
        title="Edit Student"
      >
        {selectedStudent && (
          <StudentForm 
            student={selectedStudent}
            onSubmit={handleUpdateStudent}
            onCancel={() => {setShowEditModal(false); setSelectedStudent(null);}}
          />
        )}
      </Modal>
    </div>
  );
}

// Student Form Component
function StudentForm({ 
  student, 
  onSubmit, 
  onCancel 
}: { 
  student?: Student; 
  onSubmit: (data: Partial<Student>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    // User fields
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    email: student?.email || '',
    phone: student?.phone || '',
    city: student?.city || '',
    isActive: student?.isActive !== undefined ? student.isActive : true,
    // License Information
    licenseType: student?.licenseType || 'none',
    licenseNumber: student?.licenseNumber || '',
    theoryTestPassed: student?.theoryTestPassed || false,
    theoryTestDate: student?.theoryTestDate || '',
    practicalTestDate: student?.practicalTestDate || '',
    practicalTestPassed: student?.practicalTestPassed || false,
    // Personal Information
    dateOfBirth: student?.dateOfBirth || '',
    address: student?.address || '',
    postcode: student?.postcode || '',
    emergencyContactName: student?.emergencyContact?.name || '',
    emergencyContactPhone: student?.emergencyContact?.phone || '',
    emergencyContactRelationship: student?.emergencyContact?.relationship || '',
    medicalConditions: student?.medicalConditions || '',
    // Learning Information
    learningGoals: student?.learningGoals || '',
    previousDrivingExperience: student?.previousDrivingExperience || '',
    preferredInstructorGender: student?.preferredInstructorGender || '',
    preferredLanguage: student?.preferredLanguage || 'english',
    drivingLevel: student?.drivingLevel || '',
    startDate: student?.startDate || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transform the form data to match the expected structure
    const submissionData = {
      ...formData,
      // Convert emergency contact fields to nested object
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelationship,
      },
    };
    
    // Remove the flat emergency contact fields
    delete (submissionData as any).emergencyContactName;
    delete (submissionData as any).emergencyContactPhone;
    delete (submissionData as any).emergencyContactRelationship;
    
    onSubmit(submissionData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Postcode</label>
            <input
              type="text"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium">Active</label>
          </div>
        </div>
      </div>

      {/* License Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">License Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">License Type</label>
            <select
              name="licenseType"
              value={formData.licenseType}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="none">None</option>
              <option value="provisional">Provisional</option>
              <option value="full">Full</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="theoryTestPassed"
              checked={formData.theoryTestPassed}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium">Theory Test Passed</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="practicalTestPassed"
              checked={formData.practicalTestPassed}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium">Practical Test Passed</label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Theory Test Date</label>
            <input
              type="date"
              name="theoryTestDate"
              value={formData.theoryTestDate}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Practical Test Date</label>
            <input
              type="date"
              name="practicalTestDate"
              value={formData.practicalTestDate}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Emergency Contact</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Contact Name</label>
            <input
              type="text"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Phone</label>
            <input
              type="tel"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Relationship</label>
            <input
              type="text"
              name="emergencyContactRelationship"
              value={formData.emergencyContactRelationship}
              onChange={handleChange}
              placeholder="e.g., Parent, Spouse, Friend"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Learning Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Learning Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Preferred Instructor Gender</label>
            <select
              name="preferredInstructorGender"
              value={formData.preferredInstructorGender}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">No preference</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preferred Language</label>
            <select
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Driving Level</label>
            <select
              name="drivingLevel"
              value={formData.drivingLevel}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select level</option>
              <option value="complete-beginner">Complete Beginner</option>
              <option value="some-experience">Some Experience</option>
              <option value="experienced">Experienced</option>
              <option value="refresher">Refresher Course</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Learning Goals</label>
            <textarea
              name="learningGoals"
              value={formData.learningGoals}
              onChange={handleChange}
              rows={3}
              placeholder="What are your driving goals and objectives?"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Previous Driving Experience</label>
            <textarea
              name="previousDrivingExperience"
              value={formData.previousDrivingExperience}
              onChange={handleChange}
              rows={3}
              placeholder="Describe any previous driving experience, lessons, or training"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Medical Conditions</label>
            <textarea
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleChange}
              rows={2}
              placeholder="Any medical conditions that may affect driving (optional)"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {student ? 'Update' : 'Create'} Student
        </Button>
      </div>
    </form>
  );
}