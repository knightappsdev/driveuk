import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  Star,
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
import { Course, levelColors, levelLabels } from './types';

interface CoursesTableProps {
  courses: Course[];
  onViewDetails: (course: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: number) => void;
  onToggleRecommended: (courseId: number, isRecommended: boolean) => void;
  onToggleActive: (courseId: number, isActive: boolean) => void;
}

export default function CoursesTable({ 
  courses, 
  onViewDetails,
  onEditCourse,
  onDeleteCourse,
  onToggleRecommended,
  onToggleActive
}: CoursesTableProps) {
  const handleDeleteClick = (courseId: number, courseTitle: string) => {
    if (confirm(`Are you sure you want to delete course "${courseTitle}"?`)) {
      onDeleteCourse(courseId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Courses ({courses.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Duration & Price</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">No courses found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {course.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {course.description && course.description.length > 100 
                            ? `${course.description.slice(0, 100)}...`
                            : course.description || 'No description available'
                          }
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={levelColors[course.level]}>
                        {levelLabels[course.level]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Clock className="w-3 h-3 mr-1" />
                          {course.totalHours || Math.round((course.duration || 0) / 60)} hours
                        </div>
                        <div className="flex items-center text-sm font-medium">
                          <DollarSign className="w-3 h-3 mr-1" />
                          £{course.price}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {course.studentCount || course.enrolledStudents || 0}
                        </div>
                        <div className="text-xs text-gray-500">Students</div>
                        {(course.studentCount || course.enrolledStudents || 0) > 0 && (
                          <div className="text-xs text-green-600 mt-1">
                            £{(parseFloat(course.price || '0') * (course.studentCount || course.enrolledStudents || 0)).toLocaleString()} revenue
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {course.features && course.features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {course.features && course.features.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{course.features.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={(course.isActive !== false) ? 'default' : 'secondary'}>
                          {(course.isActive !== false) ? 'Active' : 'Inactive'}
                        </Badge>
                        {course.isRecommended && (
                          <div>
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Star className="w-3 h-3 mr-1" />
                              Recommended
                            </Badge>
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
                            onClick={() => onViewDetails(course)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => onEditCourse(course)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onToggleRecommended(course.id, course.isRecommended || false)}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            {course.isRecommended ? 'Remove Recommended' : 'Mark Recommended'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onToggleActive(course.id, course.isActive !== false)}
                          >
                            {course.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-600"
                            onClick={() => handleDeleteClick(course.id, course.title)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {courses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No courses found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}