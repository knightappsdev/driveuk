import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const EMAIL_CONFIG = {
  // Where form submissions are sent
  FORM_RECIPIENT: 'dsforms@ofemo.uk',
  // Where automated responses come from
  SUPPORT_SENDER: 'support@ofemo.uk',
  // Fallback sender (in case support@ofemo.uk is not verified)
  FALLBACK_SENDER: 'noreply@resend.dev',
} as const;

export { resend };

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface FormSubmissionData {
  type: 'instructor-registration' | 'exit-intent' | 'whatsapp-contact' | 'general-inquiry';
  data: Record<string, any>;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}