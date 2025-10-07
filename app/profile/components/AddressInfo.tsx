import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { UserData } from './types';
import EditableField from './EditableField';

interface AddressInfoProps {
  userData: UserData;
  isEditing: boolean;
  onUpdateField: (field: keyof UserData, value: any) => void;
}

export default function AddressInfo({ userData, isEditing, onUpdateField }: AddressInfoProps) {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-green-600" />
          Address Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditableField
          label="Address"
          value={userData.address}
          isEditing={isEditing}
          onChange={(value) => onUpdateField('address', value)}
          placeholder="Enter your full address"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EditableField
            label="Postcode"
            value={userData.postcode}
            isEditing={isEditing}
            onChange={(value) => onUpdateField('postcode', value)}
            placeholder="SW1A 1AA"
          />
          <EditableField
            label="City"
            value={userData.city}
            isEditing={isEditing}
            onChange={(value) => onUpdateField('city', value)}
            placeholder="London"
          />
        </div>
      </CardContent>
    </Card>
  );
}