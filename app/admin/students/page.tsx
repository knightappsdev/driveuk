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
  GraduationCap,
  MapPin,
  Calendar,
  AlertTriangle
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
  // User fields
  userName: string;
  userEmail: string;
  userPhone?: string;
  userAvatar?: string;
  userIsActive: boolean;
  userCreatedAt: string;
}

const licenseStatusColors = {
  none: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  provisional: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  full: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.address && student.address.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      selectedStatus === 'all' || 
      (selectedStatus === 'active' && student.userIsActive) ||
      (selectedStatus === 'inactive' && !student.userIsActive) ||
      selectedStatus === student.licenseStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteStudent = async (studentId: number) => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/students/${studentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchStudents();
      }
    } catch (error) {
      console.error('Failed to delete student:', error);
    }
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'Unknown';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage student accounts and progress
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage student accounts and progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={fetchStudents}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">No License</p>
                <p className="text-2xl font-bold text-gray-600">
                  {students.filter(s => s.licenseStatus === 'none').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Provisional</p>
                <p className="text-2xl font-bold text-blue-600">
                  {students.filter(s => s.licenseStatus === 'provisional').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Full License</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter(s => s.licenseStatus === 'full').length}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600" />
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
                placeholder="Search students..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="none">No License</option>
              <option value="provisional">Provisional</option>
              <option value="full">Full License</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Students ({filteredStudents.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Age & Details</TableHead>
                  <TableHead>License Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Emergency Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                          {student.userAvatar ? (
                            <img 
                              src={student.userAvatar} 
                              alt={student.userName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {student.userName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {student.userName}
                          </div>
                          <div className="text-sm text-gray-500">{student.userEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          Age: {calculateAge(student.dateOfBirth)}
                        </div>
                        {student.address && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {student.address.slice(0, 30)}...
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={licenseStatusColors[student.licenseStatus]}>
                        {student.licenseStatus === 'none' ? 'No License' : 
                         student.licenseStatus === 'provisional' ? 'Provisional' : 'Full License'}
                      </Badge>
                      {student.medicalConditions && (
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            Medical Conditions
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Mail className="w-3 h-3 mr-1" />
                          {student.userEmail}
                        </div>
                        {student.userPhone && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Phone className="w-3 h-3 mr-1" />
                            {student.userPhone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.emergencyContact ? (
                        <div className="text-sm text-gray-600">
                          {student.emergencyContact}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">Not provided</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.userIsActive ? 'default' : 'secondary'}>
                        {student.userIsActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Student
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-600"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No students found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}