import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key } from 'lucide-react';
import { UserData } from './types';
import EditableField from './EditableField';

interface RoleSpecificInfoProps {
  userData: UserData;
  isEditing: boolean;
  onUpdateField: (field: keyof UserData, value: any) => void;
}

export default function RoleSpecificInfo({ userData, isEditing, onUpdateField }: RoleSpecificInfoProps) {
  if (userData.role === 'student') {
    return (
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2 text-yellow-600" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditableField
            label="License Number"
            value={userData.licenseNumber || ''}
            isEditing={isEditing}
            onChange={(value) => onUpdateField('licenseNumber', value)}
            placeholder="Your provisional license number"
          />
          
          <EditableField
            label="Learning Goals"
            value={userData.learningGoals || ''}
            isEditing={isEditing}
            onChange={(value) => onUpdateField('learningGoals', value)}
            placeholder="What are your driving goals?"
          />
        </CardContent>
      </Card>
    );
  }

  if (userData.role === 'instructor') {
    return (
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2 text-green-600" />
            Instructor Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditableField
            label="ADI Number"
            value={userData.adiNumber || ''}
            isEditing={isEditing}
            onChange={(value) => onUpdateField('adiNumber', value)}
            placeholder="Your ADI registration number"
          />
          
          <EditableField
            label="Hourly Rate (£)"
            value={userData.hourlyRate?.toString() || '0'}
            isEditing={isEditing}
            onChange={(value) => onUpdateField('hourlyRate', parseFloat(value) || 0)}
            placeholder="45"
          />
          
          <EditableField
            label="Bio"
            value={userData.bio || ''}
            isEditing={isEditing}
            onChange={(value) => onUpdateField('bio', value)}
            placeholder="Tell students about your experience..."
          />
        </CardContent>
      </Card>
    );
  }

  return null;
}