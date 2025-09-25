import { User } from '@/lib/db/schema';

export type UserRole = 'admin' | 'instructor' | 'student';

export const roleHierarchy: Record<UserRole, number> = {
  admin: 3,
  instructor: 2,
  student: 1,
};

export const rolePermissions = {
  admin: [
    'manage_users',
    'manage_instructors', 
    'manage_students',
    'manage_courses',
    'manage_settings',
    'view_analytics',
    'manage_bookings',
    'manage_lessons',
    'manage_reviews'
  ],
  instructor: [
    'view_assigned_students',
    'manage_own_lessons',
    'manage_own_bookings', 
    'view_own_schedule',
    'update_lesson_status',
    'view_student_progress'
  ],
  student: [
    'view_own_profile',
    'book_lessons',
    'view_own_lessons',
    'view_own_bookings',
    'submit_reviews'
  ]
} as const;

export type Permission = typeof rolePermissions[keyof typeof rolePermissions][number];

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: UserRole): boolean {
  if (!user) return false;
  return user.role === role;
}

/**
 * Check if user has at least the minimum required role level
 */
export function hasMinimumRole(user: User | null, minimumRole: UserRole): boolean {
  if (!user) return false;
  const userLevel = roleHierarchy[user.role as UserRole] || 0;
  const requiredLevel = roleHierarchy[minimumRole] || 0;
  return userLevel >= requiredLevel;
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  const userRole = user.role as UserRole;
  const permissions = rolePermissions[userRole] || [];
  return (permissions as readonly Permission[]).includes(permission);
}

/**
 * Check if user can access admin areas
 */
export function canAccessAdmin(user: User | null): boolean {
  return hasRole(user, 'admin');
}

/**
 * Check if user can access instructor areas  
 */
export function canAccessInstructor(user: User | null): boolean {
  return hasRole(user, 'instructor') || hasRole(user, 'admin');
}

/**
 * Check if user can manage other users
 */
export function canManageUsers(user: User | null): boolean {
  return hasPermission(user, 'manage_users');
}

/**
 * Check if user can manage students
 */
export function canManageStudents(user: User | null): boolean {
  return hasPermission(user, 'manage_students') || hasPermission(user, 'view_assigned_students');
}

/**
 * Check if user can manage lessons
 */
export function canManageLessons(user: User | null): boolean {
  return hasPermission(user, 'manage_lessons') || hasPermission(user, 'manage_own_lessons');
}

/**
 * Get user's role display name
 */
export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    admin: 'Administrator',
    instructor: 'Instructor', 
    student: 'Student'
  };
  return roleNames[role] || 'Unknown';
}

/**
 * Get available roles for user creation (based on current user's role)
 */
export function getAvailableRoles(currentUser: User | null): UserRole[] {
  if (hasRole(currentUser, 'admin')) {
    return ['admin', 'instructor', 'student'];
  }
  if (hasRole(currentUser, 'instructor')) {
    return ['student'];
  }
  return [];
}

/**
 * Validate role transition (who can change roles to what)
 */
export function canChangeRole(currentUser: User | null, fromRole: string, toRole: string): boolean {
  if (!hasRole(currentUser, 'admin')) {
    return false; // Only admins can change roles
  }
  
  // Admins can change any role to any role
  return ['admin', 'instructor', 'student'].includes(toRole);
}