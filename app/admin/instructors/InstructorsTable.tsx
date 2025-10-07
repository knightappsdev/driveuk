import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Star,
  DollarSign,
  UserPlus
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
import { Instructor, approvalColors, statusColors } from './types';

interface InstructorsTableProps {
  instructors: Instructor[];
  onViewDetails: (instructor: Instructor) => void;
  onEditInstructor: (instructor: Instructor) => void;
  onDeleteInstructor: (instructorId: number) => void;
  onApproveInstructor: (instructorId: number) => void;
}

export default function InstructorsTable({ 
  instructors, 
  onViewDetails,
  onEditInstructor,
  onDeleteInstructor,
  onApproveInstructor
}: InstructorsTableProps) {
  const handleDeleteClick = (instructorId: number, instructorName: string) => {
    if (confirm(`Are you sure you want to delete instructor ${instructorName}?`)) {
      onDeleteInstructor(instructorId);
    }
  };

  const handleApproveClick = (instructorId: number, instructorName: string) => {
    if (confirm(`Are you sure you want to approve instructor ${instructorName}?`)) {
      onApproveInstructor(instructorId);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Instructor</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instructors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <UserPlus className="h-8 w-8 text-gray-400" />
                    <p className="text-gray-500">No instructors found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              instructors.map((instructor) => (
                <TableRow key={instructor.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {instructor.userName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {instructor.userEmail}
                      </div>
                      {instructor.userPhone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {instructor.userPhone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm font-medium">{instructor.experience} years</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {instructor.specialties && instructor.specialties.length > 0 ? (
                        instructor.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">None specified</span>
                      )}
                      {instructor.specialties && instructor.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{instructor.specialties.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-green-600" />
                      <span className="text-sm font-medium">£{instructor.pricePerHour}/hr</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      {instructor.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[instructor.userIsActive ? 'active' : 'inactive']}>
                      {instructor.userIsActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={approvalColors[instructor.isApproved.toString() as keyof typeof approvalColors]}>
                      {instructor.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="flex items-center"
                          onClick={() => onViewDetails(instructor)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center"
                          onClick={() => onEditInstructor(instructor)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Instructor
                        </DropdownMenuItem>
                        {!instructor.isApproved && (
                          <DropdownMenuItem 
                            className="flex items-center text-green-600"
                            onClick={() => handleApproveClick(instructor.id, instructor.userName)}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="flex items-center">
                          <Mail className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center text-red-600"
                          onClick={() => handleDeleteClick(instructor.id, instructor.userName)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}