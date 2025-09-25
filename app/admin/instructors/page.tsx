'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  UserPlus, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  RefreshCw,
  CheckCircle,
  XCircle,
  MapPin,
  Star,
  Clock,
  DollarSign
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Import modal components
import InstructorDetailsModal from '@/components/admin/instructors/instructor-details-modal';
import InstructorEditModal from '@/components/admin/instructors/instructor-edit-modal';
import InstructorCreateModal from '@/components/admin/instructors/instructor-create-modal';

interface Instructor {
  id: number;
  userId: number;
  licenseNumber: string;
  experience: number;
  specialties: string[];
  transmissionTypes: string[];
  pricePerHour: string;
  location: string;
  bio?: string;
  availability?: string;
  languages?: string[];
  nationality?: string;
  religion?: string;
  ethnicity?: string;
  gender?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  // User fields
  userName: string;
  userEmail: string;
  userPhone?: string;
  userAvatar?: string;
  userIsActive: boolean;
  userCreatedAt: string;
}

const approvalColors = {
  true: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  false: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
};

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/instructors');
      if (response.ok) {
        const data = await response.json();
        setInstructors(data);
      }
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = 
      instructor.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'all' || 
      (selectedStatus === 'approved' && instructor.isApproved) ||
      (selectedStatus === 'pending' && !instructor.isApproved) ||
      (selectedStatus === 'active' && instructor.userIsActive) ||
      (selectedStatus === 'inactive' && !instructor.userIsActive);
    
    return matchesSearch && matchesStatus;
  });

  const handleToggleApproval = async (instructorId: number, isApproved: boolean) => {
    try {
      const response = await fetch(`/api/admin/instructors/${instructorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved: !isApproved }),
      });

      if (response.ok) {
        fetchInstructors();
      }
    } catch (error) {
      console.error('Failed to toggle approval:', error);
    }
  };

  const handleDeleteInstructor = async (instructorId: number) => {
    if (!confirm('Are you sure you want to delete this instructor? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/instructors/${instructorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchInstructors();
      }
    } catch (error) {
      console.error('Failed to delete instructor:', error);
    }
  };

  // Modal handlers
  const handleViewInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsDetailsModalOpen(true);
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsEditModalOpen(true);
  };

  const handleInstructorCreated = () => {
    fetchInstructors();
  };

  const handleInstructorUpdated = () => {
    fetchInstructors();
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
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
            onClick={fetchInstructors}
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Instructors</p>
                <p className="text-2xl font-bold text-gray-900">{instructors.length}</p>
              </div>
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {instructors.filter(i => i.isApproved).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {instructors.filter(i => !i.isApproved).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-blue-600">
                  {instructors.filter(i => i.userIsActive && i.isApproved).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Approval</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Instructors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Instructors ({filteredInstructors.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instructor</TableHead>
                  <TableHead>License & Experience</TableHead>
                  <TableHead>Specialties</TableHead>
                  <TableHead>Rate & Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstructors.map((instructor) => (
                  <TableRow key={instructor.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                          {instructor.userAvatar ? (
                            <img 
                              src={instructor.userAvatar} 
                              alt={instructor.userName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {instructor.userName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {instructor.userName}
                          </div>
                          <div className="text-sm text-gray-500">{instructor.userEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{instructor.licenseNumber}</div>
                        <div className="text-sm text-gray-500">
                          {instructor.experience} years experience
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {instructor.specialties.slice(0, 2).map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {instructor.specialties.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{instructor.specialties.length - 2}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {instructor.transmissionTypes.map((type, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">£{instructor.pricePerHour}/hr</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {instructor.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={approvalColors[instructor.isApproved.toString() as keyof typeof approvalColors]}>
                          {instructor.isApproved ? 'Approved' : 'Pending'}
                        </Badge>
                        <div>
                          <Badge variant={instructor.userIsActive ? 'default' : 'secondary'}>
                            {instructor.userIsActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Mail className="w-3 h-3 mr-1" />
                          {instructor.userEmail}
                        </div>
                        {instructor.userPhone && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Phone className="w-3 h-3 mr-1" />
                            {instructor.userPhone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleViewInstructor(instructor)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleEditInstructor(instructor)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Instructor
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleToggleApproval(instructor.id, instructor.isApproved)}
                          >
                            {instructor.isApproved ? (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Revoke Approval
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-600"
                            onClick={() => handleDeleteInstructor(instructor.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Instructor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredInstructors.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No instructors found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
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