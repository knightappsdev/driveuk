import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Globe,
  Phone,
  Mail,  
  MapPin,
  Clock,
  DollarSign,
  Shield,
  Database
} from 'lucide-react';
import { SettingsForm as SettingsFormType } from './types';

interface SettingsFormProps {
  formData: SettingsFormType;
  onInputChange: (key: keyof SettingsFormType, value: string) => void;
}

export default function SettingsForm({ formData, onInputChange }: SettingsFormProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={formData.siteName}
              onChange={(e) => onInputChange('siteName', e.target.value)}
              placeholder="DriveSchool Pro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input
              id="siteDescription"
              value={formData.siteDescription}
              onChange={(e) => onInputChange('siteDescription', e.target.value)}
              placeholder="Professional driving lessons across the UK"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAddress" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Business Address
            </Label>
            <Input
              id="businessAddress"
              value={formData.businessAddress}
              onChange={(e) => onInputChange('businessAddress', e.target.value)}
              placeholder="123 Driving School Lane, London, UK"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operatingHours" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Operating Hours
            </Label>
            <Input
              id="operatingHours"
              value={formData.operatingHours}
              onChange={(e) => onInputChange('operatingHours', e.target.value)}
              placeholder="Monday-Friday: 8AM-6PM"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Email
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => onInputChange('contactEmail', e.target.value)}
              placeholder="info@driveschoolpro.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact Phone
            </Label>
            <Input
              id="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => onInputChange('contactPhone', e.target.value)}
              placeholder="+44 7756 183 484"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              type="tel"
              value={formData.whatsappNumber}
              onChange={(e) => onInputChange('whatsappNumber', e.target.value)}
              placeholder="+44 7756 183 484"
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Business Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultLessonDuration">Default Lesson Duration (minutes)</Label>
            <Input
              id="defaultLessonDuration"
              type="number"
              value={formData.defaultLessonDuration}
              onChange={(e) => onInputChange('defaultLessonDuration', e.target.value)}
              placeholder="120"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultLessonPrice">Default Lesson Price (£)</Label>
            <Input
              id="defaultLessonPrice"
              type="number"
              value={formData.defaultLessonPrice}
              onChange={(e) => onInputChange('defaultLessonPrice', e.target.value)}
              placeholder="45"
            />
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="enableNotifications">Enable Notifications</Label>
            <select
              id="enableNotifications"
              value={formData.enableNotifications}
              onChange={(e) => onInputChange('enableNotifications', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="enableBookings">Enable Bookings</Label>
            <select
              id="enableBookings"
              value={formData.enableBookings}
              onChange={(e) => onInputChange('enableBookings', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            <select
              id="maintenanceMode"
              value={formData.maintenanceMode}
              onChange={(e) => onInputChange('maintenanceMode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="false">Disabled</option>
              <option value="true">Enabled</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}