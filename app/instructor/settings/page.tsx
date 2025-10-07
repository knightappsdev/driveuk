'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
// Simple Switch replacement
const Switch = ({ checked, onCheckedChange, id }: { checked: boolean, onCheckedChange: (checked: boolean) => void, id?: string }) => (
  <input 
    type="checkbox" 
    checked={checked} 
    onChange={(e) => onCheckedChange(e.target.checked)}
    id={id}
    className="toggle"
  />
);
import { Input } from '@/components/ui/input';
import { 
  Save, 
  Settings as SettingsIcon,
  Bell,
  Clock,
  Calendar,
  Mail,
  MessageSquare,
  BookOpen
} from 'lucide-react';

interface WorkingHours {
  start: string;
  end: string;
  enabled: boolean;
}

interface InstructorSettings {
  enableNotifications: boolean;
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  autoAcceptBookings: boolean;
  workingHours: {
    monday: WorkingHours;
    tuesday: WorkingHours;
    wednesday: WorkingHours;
    thursday: WorkingHours;
    friday: WorkingHours;
    saturday: WorkingHours;
    sunday: WorkingHours;
  };
  defaultLessonDuration: number;
  bufferTimeBetweenLessons: number;
}

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

export default function InstructorSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<InstructorSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/instructor/settings');
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
      } else {
        console.error('Failed to fetch settings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/instructor/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Settings updated successfully');
      } else {
        console.error('Failed to update settings:', data.error);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof InstructorSettings, value: any) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
  };

  const updateWorkingHours = (day: string, field: keyof WorkingHours, value: any) => {
    setSettings(prev => prev ? {
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          [field]: value
        }
      }
    } : null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings Not Found</h2>
          <p className="text-gray-600">Unable to load your settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Settings</h1>
          <p className="text-gray-600">Manage your preferences and availability</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </Button>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableNotifications">Enable Notifications</Label>
              <p className="text-sm text-gray-600">Receive notifications for bookings and messages</p>
            </div>
            <Switch
              id="enableNotifications"
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableEmailNotifications">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <Switch
              id="enableEmailNotifications"
              checked={settings.enableEmailNotifications}
              onCheckedChange={(checked) => updateSetting('enableEmailNotifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableSmsNotifications">SMS Notifications</Label>
              <p className="text-sm text-gray-600">Receive notifications via text message</p>
            </div>
            <Switch
              id="enableSmsNotifications"
              checked={settings.enableSmsNotifications}
              onCheckedChange={(checked) => updateSetting('enableSmsNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Booking Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Booking Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoAcceptBookings">Auto-accept Bookings</Label>
              <p className="text-sm text-gray-600">Automatically accept new booking requests</p>
            </div>
            <Switch
              id="autoAcceptBookings"
              checked={settings.autoAcceptBookings}
              onCheckedChange={(checked) => updateSetting('autoAcceptBookings', checked)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="defaultLessonDuration">Default Lesson Duration (minutes)</Label>
              <Input
                id="defaultLessonDuration"
                type="number"
                value={settings.defaultLessonDuration}
                onChange={(e) => updateSetting('defaultLessonDuration', parseInt(e.target.value))}
                min="30"
                max="180"
                step="15"
              />
            </div>
            <div>
              <Label htmlFor="bufferTimeBetweenLessons">Buffer Time Between Lessons (minutes)</Label>
              <Input
                id="bufferTimeBetweenLessons"
                type="number"
                value={settings.bufferTimeBetweenLessons}
                onChange={(e) => updateSetting('bufferTimeBetweenLessons', parseInt(e.target.value))}
                min="0"
                max="60"
                step="5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Working Hours</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {daysOfWeek.map(({ key, label }) => {
            const daySettings = settings.workingHours[key as keyof typeof settings.workingHours];
            return (
              <div key={key} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-20">
                  <Label>{label}</Label>
                </div>
                <Switch
                  checked={daySettings.enabled}
                  onCheckedChange={(checked) => updateWorkingHours(key, 'enabled', checked)}
                />
                {daySettings.enabled && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">From:</Label>
                      <Input
                        type="time"
                        value={daySettings.start}
                        onChange={(e) => updateWorkingHours(key, 'start', e.target.value)}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">To:</Label>
                      <Input
                        type="time"
                        value={daySettings.end}
                        onChange={(e) => updateWorkingHours(key, 'end', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}