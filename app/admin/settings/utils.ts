import { Setting, SettingsForm } from './types';

export const fetchSettings = async (): Promise<Setting[]> => {
  try {
    const response = await fetch('/api/admin/settings');
    if (response.ok) {
      const data = await response.json();
      console.log('Settings API Response:', data);
      
      if (Array.isArray(data)) {
        return data;
      } else if (data.success && data.data) {
        // Convert nested object structure to flat array
        const settings: Setting[] = [];
        let idCounter = 1;
        
        Object.entries(data.data).forEach(([category, categorySettings]: [string, any]) => {
          Object.entries(categorySettings).forEach(([key, setting]: [string, any]) => {
            settings.push({
              id: idCounter++,
              key: key,
              value: setting.value || '',
              description: setting.description || '',
              updatedAt: setting.updatedAt || new Date().toISOString()
            });
          });
        });
        
        return settings;
      } else {
        console.error('Invalid API response format - expected object with categories, got:', data);
        return [];
      }
    } else {
      console.error('API request failed:', response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return [];
  }
};

export const saveSettings = async (formData: SettingsForm): Promise<boolean> => {
  try {
    console.log('Saving settings:', Object.keys(formData));
    
    const promises = Object.entries(formData).map(([key, value]) =>
      fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      })
    );

    const responses = await Promise.all(promises);
    
    // Check each response and log detailed errors
    const results = await Promise.all(
      responses.map(async (response, index) => {
        const key = Object.keys(formData)[index];
        if (response.ok) {
          console.log(`✓ Successfully saved setting "${key}"`);
          return { key, success: true };
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Network or parsing error' }));
          console.error(`✗ Failed to save setting "${key}":`, response.status, response.statusText, errorData);
          return { key, success: false, error: errorData, status: response.status };
        }
      })
    );

    const allSuccessful = results.every(result => result.success);

    if (allSuccessful) {
      console.log(`✅ All ${results.length} settings saved successfully`);
      return true;
    } else {
      const failedSettings = results.filter(result => !result.success);
      const successCount = results.length - failedSettings.length;
      console.error(`❌ ${failedSettings.length} out of ${results.length} settings failed to save:`);
      failedSettings.forEach(failed => {
        console.error(`  - ${failed.key}: ${failed.error?.error || 'Unknown error'} (${failed.status || 'No status'})`);
      });
      console.log(`✅ ${successCount} settings saved successfully`);
      return false;
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

export const mapSettingsToForm = (settings: Setting[]): SettingsForm => {
  const settingsMap = settings.reduce((acc: any, setting: Setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});

  return {
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
  };
};