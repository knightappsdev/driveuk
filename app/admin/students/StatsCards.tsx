import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, CheckCircle, Calendar, Target } from 'lucide-react';
import { Student } from './types';

interface StatsCardsProps {
  students: Student[];
}

export default function StatsCards({ students }: StatsCardsProps) {
  const activeStudents = students.filter(s => s.isActive).length;
  const theoryPassed = students.filter(s => s.theoryTestPassed).length;
  const practicalPassed = students.filter(s => s.practicalTestPassed).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {students.length}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeStudents}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Theory Passed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {theoryPassed}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Practical Passed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {practicalPassed}
              </p>
            </div>
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}