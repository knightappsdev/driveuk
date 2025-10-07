import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, CheckCircle, Clock, Star } from 'lucide-react';
import { Instructor } from './types';

interface StatsCardsProps {
  instructors: Instructor[];
}

export default function StatsCards({ instructors }: StatsCardsProps) {
  const totalInstructors = instructors.length;
  const approvedInstructors = instructors.filter(i => i.isApproved).length;
  const pendingInstructors = instructors.filter(i => !i.isApproved).length;
  const activeInstructors = instructors.filter(i => i.userIsActive && i.isApproved).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Instructors</p>
              <p className="text-2xl font-bold text-gray-900">{totalInstructors}</p>
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
              <p className="text-2xl font-bold text-green-600">{approvedInstructors}</p>
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
              <p className="text-2xl font-bold text-yellow-600">{pendingInstructors}</p>
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
              <p className="text-2xl font-bold text-blue-600">{activeInstructors}</p>
            </div>
            <Star className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}