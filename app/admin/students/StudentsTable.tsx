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
  BookOpen
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
import { Student, statusColors, testStatusColors } from './types';

interface StudentsTableProps {
  students: Student[];
  onDeleteStudent: (studentId: number) => void;
  onViewStudent?: (student: Student) => void;
  onEditStudent?: (student: Student) => void;
  onSendMessage?: (student: Student) => void;
}

export default function StudentsTable({ students, onDeleteStudent, onViewStudent, onEditStudent, onSendMessage }: StudentsTableProps) {

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>License Info</TableHead>
              <TableHead>Test Status</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                    <p className="text-gray-500">No students found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {student.email}
                      </div>
                      {student.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {student.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{student.licenseType || 'None'}</div>
                      {student.licenseNumber && (
                        <div className="text-sm text-gray-500">{student.licenseNumber}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={testStatusColors[student.theoryTestPassed.toString() as keyof typeof testStatusColors]}>
                        Theory: {student.theoryTestPassed ? 'Passed' : 'Pending'}
                      </Badge>
                      <div>
                        <Badge className={testStatusColors[student.practicalTestPassed.toString() as keyof typeof testStatusColors]}>
                          Practical: {student.practicalTestPassed ? 'Passed' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[student.isActive ? 'active' : 'inactive']}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </div>
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
                          onClick={() => onViewStudent?.(student)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center"
                          onClick={() => onEditStudent?.(student)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Student
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center"
                          onClick={() => onSendMessage?.(student)}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center text-red-600"
                          onClick={() => onDeleteStudent(student.id)}
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