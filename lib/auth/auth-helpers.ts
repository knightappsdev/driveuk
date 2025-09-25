import { User } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { UserRole, hasRole, hasMinimumRole, hasPermission, Permission } from './roles';

/**
 * Require authenticated user, redirect if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }
  return user;
}

/**
 * Require user with specific role, redirect if unauthorized
 */
export async function requireRole(role: UserRole): Promise<User> {
  const user = await requireAuth();
  if (!hasRole(user, role)) {
    redirect('/unauthorized');
  }
  return user;
}

/**
 * Require user with minimum role level, redirect if unauthorized
 */
export async function requireMinimumRole(minimumRole: UserRole): Promise<User> {
  const user = await requireAuth();
  if (!hasMinimumRole(user, minimumRole)) {
    redirect('/unauthorized');
  }
  return user;
}

/**
 * Require user with specific permission, redirect if unauthorized
 */
export async function requirePermission(permission: Permission): Promise<User> {
  const user = await requireAuth();
  if (!hasPermission(user, permission)) {
    redirect('/unauthorized');
  }
  return user;
}

/**
 * Require admin access, redirect if unauthorized
 */
export async function requireAdmin(): Promise<User> {
  return await requireRole('admin');
}

/**
 * Require instructor access (instructor or admin), redirect if unauthorized  
 */
export async function requireInstructor(): Promise<User> {
  return await requireMinimumRole('instructor');
}

/**
 * Get user with role validation (returns null if user doesn't have required role)
 */
export async function getUserWithRole(role: UserRole): Promise<User | null> {
  const user = await getUser();
  if (!user || !hasRole(user, role)) {
    return null;
  }
  return user;
}

/**
 * Get user with minimum role validation
 */
export async function getUserWithMinimumRole(minimumRole: UserRole): Promise<User | null> {
  const user = await getUser();
  if (!user || !hasMinimumRole(user, minimumRole)) {
    return null;
  }
  return user;
}

/**
 * Check if current user can access admin areas
 */
export async function canAccessAdminAreas(): Promise<boolean> {
  const user = await getUser();
  return hasRole(user, 'admin');
}

/**
 * Check if current user can access instructor areas
 */
export async function canAccessInstructorAreas(): Promise<boolean> {
  const user = await getUser();
  return hasMinimumRole(user, 'instructor');
}

/**
 * Get redirect path based on user role (for post-login routing)
 */
export function getDefaultRedirectPath(user: User): string {
  switch (user.role) {
    case 'admin':
      return '/admin';
    case 'instructor': 
      return '/instructor';
    case 'student':
      return '/';
    default:
      return '/';
  }
}

/**
 * Validate API access with role requirement
 */
export async function validateApiAccess(requiredRole?: UserRole, requiredPermission?: Permission): Promise<User | null> {
  const user = await getUser();
  
  if (!user) {
    return null;
  }
  
  if (requiredRole && !hasRole(user, requiredRole)) {
    return null;
  }
  
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return null;
  }
  
  return user;
}