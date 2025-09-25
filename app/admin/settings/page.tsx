'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Settings as SettingsIcon, 
  Save,
  RefreshCw,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Shield,
  Database,
  Bell
} from 'lucide-react';

interface Setting {
  id: number;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

interface SettingsForm {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  businessAddress: string;
  operatingHours: string;
  defaultLessonDuration: string;
  defaultLessonPrice: string;
  enableNotifications: string;
  enableBookings: string;
  maintenanceMode: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SettingsForm>({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    whatsappNumber: '',
    businessAddress: '',
    operatingHours: '',
    defaultLessonDuration: '',
    defaultLessonPrice: '',
    enableNotifications: 'true',
    enableBookings: 'true',
    maintenanceMode: 'false',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        
        // Populate form with existing settings
        const settingsMap = data.reduce((acc: any, setting: Setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {});

        setFormData({
          siteName: settingsMap.siteName || 'DriveSchool Pro',
          siteDescription: settingsMap.siteDescription || 'Professional driving lessons across the UK',
          contactEmail: settingsMap.contactEmail || 'info@driveschoolpro.com',
          contactPhone: settingsMap.contactPhone || '+44 7756 183 484',
          whatsappNumber: settingsMap.whatsappNumber || '+44 7756 183 484',
          businessAddress: settingsMap.businessAddress || '123 Driving School Lane, London, UK',
          operatingHours: settingsMap.operatingHours || 'Monday-Friday: 8AM-6PM, Saturday: 9AM-4PM',
          defaultLessonDuration: settingsMap.defaultLessonDuration || '120',
          defaultLessonPrice: settingsMap.defaultLessonPrice || '45',
          enableNotifications: settingsMap.enableNotifications || 'true',
          enableBookings: settingsMap.enableBookings || 'true',
          maintenanceMode: settingsMap.maintenanceMode || 'false',
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Convert form data to individual setting updates
      const settingsToUpdate = Object.entries(formData);
      
      for (const [key, value] of settingsToUpdate) {
        // Try to update existing setting, or create new one
        const response = await fetch('/api/admin/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key,
            value,
            description: getSettingDescription(key),
          }),
        });

        // If setting exists, update it instead
        if (!response.ok && response.status === 400) {
          await fetch(`/api/admin/settings/${key}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              value,
              description: getSettingDescription(key),
            }),
          });
        }
      }

      fetchSettings(); // Refresh settings
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const getSettingDescription = (key: string): string => {
    const descriptions: { [key: string]: string } = {
      siteName: 'The name of your driving school',
      siteDescription: 'Brief description of your driving school',
      contactEmail: 'Main contact email address',
      contactPhone: 'Main contact phone number',
      whatsappNumber: 'WhatsApp Business number for bookings',
      businessAddress: 'Physical address of the driving school',
      operatingHours: 'Business operating hours',
      defaultLessonDuration: 'Default lesson duration in minutes',
      defaultLessonPrice: 'Default lesson price in GBP',
      enableNotifications: 'Enable/disable system notifications',
      enableBookings: 'Enable/disable online booking system',
      maintenanceMode: 'Enable/disable maintenance mode',
    };
    return descriptions[key] || '';
  };

  const handleInputChange = (key: keyof SettingsForm, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Configure system-wide settings and preferences
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={fetchSettings}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className={`h-4 w-4 ${saving ? 'animate-spin' : ''}`} />
            Save Settings
          </Button>
        </div>
      </div>

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
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                placeholder="DriveSchool Pro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input
                id="siteDescription"
                value={formData.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
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
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
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
                onChange={(e) => handleInputChange('operatingHours', e.target.value)}
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
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
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
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="+44 7756 183 484"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                WhatsApp Number
              </Label>
              <Input
                id="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="+44 7756 183 484"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lesson Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Lesson Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultLessonDuration">Default Lesson Duration (minutes)</Label>
              <Input
                id="defaultLessonDuration"
                type="number"
                value={formData.defaultLessonDuration}
                onChange={(e) => handleInputChange('defaultLessonDuration', e.target.value)}
                placeholder="120"
                min="30"
                max="480"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultLessonPrice" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Default Lesson Price (£)
              </Label>
              <Input
                id="defaultLessonPrice"
                type="number"
                value={formData.defaultLessonPrice}
                onChange={(e) => handleInputChange('defaultLessonPrice', e.target.value)}
                placeholder="45"
                min="1"
                step="0.01"
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
              <Label htmlFor="enableNotifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Enable Notifications
              </Label>
              <select
                id="enableNotifications"
                value={formData.enableNotifications}
                onChange={(e) => handleInputChange('enableNotifications', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enableBookings" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Enable Online Bookings
              </Label>
              <select
                id="enableBookings"
                value={formData.enableBookings}
                onChange={(e) => handleInputChange('enableBookings', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenanceMode" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Maintenance Mode
              </Label>
              <select
                id="maintenanceMode"
                value={formData.maintenanceMode}
                onChange={(e) => handleInputChange('maintenanceMode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="false">Disabled</option>
                <option value="true">Enabled</option>
              </select>
              <p className="text-sm text-gray-500">
                When enabled, only admins can access the site
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Settings Display */}
      <Card>
        <CardHeader>
          <CardTitle>Current Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Setting Key</th>
                  <th className="text-left py-2">Current Value</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {settings.map((setting) => (
                  <tr key={setting.id} className="border-b">
                    <td className="py-2 font-mono text-sm">{setting.key}</td>
                    <td className="py-2 text-sm">{setting.value}</td>
                    <td className="py-2 text-sm text-gray-500">{setting.description || 'No description'}</td>
                    <td className="py-2 text-sm text-gray-500">
                      {new Date(setting.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {settings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No settings configured yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}