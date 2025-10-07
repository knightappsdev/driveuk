'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save } from 'lucide-react';
import { Setting, SettingsForm as SettingsFormType } from './types';
import { fetchSettings, saveSettings, mapSettingsToForm } from './utils';
import StatsCards from './StatsCards';
import SettingsForm from './SettingsForm';
import MaintenanceToggle from '@/components/admin/MaintenanceToggle';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SettingsFormType>({
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
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await fetchSettings();
    setSettings(data);
    setFormData(mapSettingsToForm(data));
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const success = await saveSettings(formData);
      if (success) {
        alert('Settings saved successfully');
        await loadSettings(); // Refresh settings after save
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: keyof SettingsFormType, value: string) => {
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
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            onClick={loadSettings}
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

      <StatsCards settings={settings} />

      <MaintenanceToggle 
        initialValue={formData.maintenanceMode === 'true'}
        onToggle={() => loadSettings()} // Refresh settings after toggle
      />

      <SettingsForm 
        formData={formData}
        onInputChange={handleInputChange}
      />
    </div>
  );
}
