import { Card, CardContent } from '@/components/ui/card';
import { SettingsIcon, Globe, Shield, Database } from 'lucide-react';
import { Setting } from './types';

interface StatsCardsProps {
  settings: Setting[];
}

export default function StatsCards({ settings }: StatsCardsProps) {
  const totalSettings = settings.length;
  const maintenanceMode = settings.find(s => s.key === 'maintenanceMode')?.value === 'true';
  const notificationsEnabled = settings.find(s => s.key === 'enableNotifications')?.value === 'true';
  const bookingsEnabled = settings.find(s => s.key === 'enableBookings')?.value === 'true';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Settings</p>
              <p className="text-2xl font-bold text-gray-900">{totalSettings}</p>
            </div>
            <SettingsIcon className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Site Status</p>
              <p className={`text-2xl font-bold ${maintenanceMode ? 'text-red-600' : 'text-green-600'}`}>
                {maintenanceMode ? 'Maintenance' : 'Live'}
              </p>
            </div>
            <Globe className={`h-8 w-8 ${maintenanceMode ? 'text-red-600' : 'text-green-600'}`} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className={`text-2xl font-bold ${notificationsEnabled ? 'text-green-600' : 'text-gray-600'}`}>
                {notificationsEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <Shield className={`h-8 w-8 ${notificationsEnabled ? 'text-green-600' : 'text-gray-600'}`} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bookings</p>
              <p className={`text-2xl font-bold ${bookingsEnabled ? 'text-green-600' : 'text-gray-600'}`}>
                {bookingsEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <Database className={`h-8 w-8 ${bookingsEnabled ? 'text-green-600' : 'text-gray-600'}`} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}