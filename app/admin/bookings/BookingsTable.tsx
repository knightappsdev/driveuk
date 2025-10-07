import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  DollarSign,
  User,
  GraduationCap
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
import { Booking, statusColors, statusLabels } from './types';

interface BookingsTableProps {
  bookings: Booking[];
  onViewDetails: (booking: Booking) => void;
  onEditBooking: (booking: Booking) => void;
  onDeleteBooking: (bookingId: number) => void;
  onUpdateStatus: (bookingId: number, status: string) => void;
}

export default function BookingsTable({ 
  bookings, 
  onViewDetails,
  onEditBooking,
  onDeleteBooking,
  onUpdateStatus
}: BookingsTableProps) {
  const handleDeleteClick = (bookingId: number, studentName: string) => {
    if (confirm(`Are you sure you want to delete booking for ${studentName}?`)) {
      onDeleteBooking(bookingId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Bookings ({bookings.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">No bookings found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {booking.studentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.studentEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.instructorName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        <span className="text-sm">{booking.courseTitle}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          {new Date(booking.scheduledDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(booking.scheduledDate).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-sm">{booking.duration} mins</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        £{booking.totalCost}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[booking.status]}>
                        {statusLabels[booking.status]}
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
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => onViewDetails(booking)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => onEditBooking(booking)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Booking
                          </DropdownMenuItem>
                          {booking.status === 'pending' && (
                            <DropdownMenuItem
                              className="cursor-pointer text-green-600"
                              onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                            >
                              Confirm Booking
                            </DropdownMenuItem>
                          )}
                          {booking.status === 'confirmed' && (
                            <DropdownMenuItem
                              className="cursor-pointer text-blue-600"
                              onClick={() => onUpdateStatus(booking.id, 'completed')}
                            >
                              Mark Completed
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-600"
                            onClick={() => handleDeleteClick(booking.id, booking.studentName)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Booking
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
      </CardContent>
    </Card>
  );
}