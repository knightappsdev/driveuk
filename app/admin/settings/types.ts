export interface Setting {
  id: number;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

export interface SettingsForm {
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

export const settingCategories = {
  general: 'General Settings',
  contact: 'Contact Information',
  business: 'Business Settings',
  system: 'System Settings'
} as const;