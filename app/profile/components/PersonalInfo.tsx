import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { UserData } from './types';
import EditableField from './EditableField';

interface PersonalInfoProps {
  userData: UserData;
  isEditing: boolean;
  onUpdateField: (field: keyof UserData, value: any) => void;
}

export default function PersonalInfo({ userData, isEditing, onUpdateField }: PersonalInfoProps) {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EditableField
            label="First Name"
            value={userData.firstName}
            isEditing={isEditing}
            onChange={(value) => onUpdateField('firstName', value)}
          />
          <EditableField
            label="Last Name"
            value={userData.lastName}
            isEditing={isEditing}
            onChange={(value) => onUpdateField('lastName', value)}
          />
        </div>
        
        <EditableField
          label="Email"
          value={userData.email}
          isEditing={isEditing}
          onChange={(value) => onUpdateField('email', value)}
          type="email"
        />
        
        <EditableField
          label="Phone"
          value={userData.phone}
          isEditing={isEditing}
          onChange={(value) => onUpdateField('phone', value)}
          type="tel"
        />
        
        <EditableField
          label="Date of Birth"
          value={userData.dateOfBirth}
          isEditing={isEditing}
          onChange={(value) => onUpdateField('dateOfBirth', value)}
          type="date"
        />
      </CardContent>
    </Card>
  );
}