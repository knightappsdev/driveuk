import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Check, X } from 'lucide-react';
import { UserData } from './types';

interface AccountStatusProps {
  userData: UserData;
}

export default function AccountStatus({ userData }: AccountStatusProps) {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2 text-green-600" />
          Account Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Email Verified</span>
            {userData.isEmailVerified ? (
              <Badge className="bg-green-100 text-green-800">
                <Check className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge variant="destructive">
                <X className="w-3 h-3 mr-1" />
                Not Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Account Status</span>
            <Badge className="bg-green-100 text-green-800">
              <Check className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Profile Complete</span>
            <Badge className="bg-blue-100 text-blue-800">
              85%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}