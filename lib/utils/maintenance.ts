import { db } from '@/lib/db/drizzle';
import { systemSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Check if maintenance mode is enabled
 * @returns Promise<boolean> - true if maintenance mode is enabled
 */
export async function isMaintenanceModeEnabled(): Promise<boolean> {
  try {
    const setting = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, 'maintenanceMode'))
      .limit(1);

    if (setting.length === 0) {
      // If setting doesn't exist, maintenance mode is disabled by default
      return false;
    }

    // Convert string value to boolean
    return setting[0].value.toLowerCase() === 'true';
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    // If there's an error, default to maintenance mode disabled
    return false;
  }
}

/**
 * Check if the current user is an admin based on JWT token
 * @param authToken - JWT token string
 * @returns Promise<boolean> - true if user is admin
 */
export async function isUserAdmin(authToken: string): Promise<boolean> {
  try {
    if (!authToken) {
      return false;
    }

    // Import JWT verification
    const { verifyToken } = await import('@/lib/auth/jwt');
    
    // Verify and decode the token
    const payload = await verifyToken(authToken);
    
    return payload?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get maintenance mode status for API endpoints
 */
export async function getMaintenanceStatus() {
  const isEnabled = await isMaintenanceModeEnabled();
  
  return {
    isEnabled,
    message: isEnabled 
      ? 'Site is currently under maintenance. Please try again later.' 
      : 'Site is operational',
    estimatedCompletion: isEnabled 
      ? 'Updates in progress - please check back soon' 
      : null
  };
}