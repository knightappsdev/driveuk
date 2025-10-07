import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';
import { UserData } from './types';
import EditableField from './EditableField';

interface EmergencyContactProps {
  userData: UserData;
  isEditing: boolean;
  onUpdateField: (field: keyof UserData, value: any) => void;
}

export default function EmergencyContact({ userData, isEditing, onUpdateField }: EmergencyContactProps) {
  const handleEmergencyContactChange = (field: string, value: string) => {
    onUpdateField('emergencyContact', {
      ...userData.emergencyContact,
      [field]: value
    });
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Phone className="w-5 h-5 mr-2 text-red-600" />
          Emergency Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditableField
          label="Contact Name"
          value={userData.emergencyContact.name}
          isEditing={isEditing}
          onChange={(value) => handleEmergencyContactChange('name', value)}
          placeholder="Full name of emergency contact"
        />
        
        <EditableField
          label="Contact Phone"
          value={userData.emergencyContact.phone}
          isEditing={isEditing}
          onChange={(value) => handleEmergencyContactChange('phone', value)}
          type="tel"
          placeholder="07123456789"
        />
        
        <EditableField
          label="Relationship"
          value={userData.emergencyContact.relationship}
          isEditing={isEditing}
          onChange={(value) => handleEmergencyContactChange('relationship', value)}
          placeholder="e.g., spouse, parent, sibling"
        />
      </CardContent>
    </Card>
  );
}