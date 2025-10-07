import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Camera } from 'lucide-react';
import { UserData, roleColors, roleLabels } from './types';
import { formatMemberSince } from './utils';

interface ProfilePhotoProps {
  userData: UserData;
  isEditing: boolean;
}

export default function ProfilePhoto({ userData, isEditing }: ProfilePhotoProps) {
  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-6 text-center">
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-16 h-16 text-blue-600" />
          </div>
          {isEditing && (
            <Button
              size="sm"
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full p-0"
            >
              <Camera className="w-5 h-5" />
            </Button>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          {userData.firstName} {userData.lastName}
        </h3>
        <div className="flex justify-center mt-2">
          <Badge className={roleColors[userData.role]}>
            {roleLabels[userData.role]}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Member since {formatMemberSince(userData.joinDate)}
        </p>
      </CardContent>
    </Card>
  );
}