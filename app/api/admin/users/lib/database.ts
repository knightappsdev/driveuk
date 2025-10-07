import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { UserApiResponse } from './types';

export const fetchAllUsers = async (): Promise<any[]> => {
  return await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      role: users.role,
      city: users.city,
      isActive: users.isActive,
      isEmailVerified: users.isEmailVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      lastLoginAt: users.lastLoginAt,
    })
    .from(users)
    .orderBy(users.createdAt);
};

export const mapUsersWithName = (usersData: any[]): UserApiResponse[] => {
  return usersData.map(user => ({
    ...user,
    name: `${user.firstName} ${user.lastName}`.trim(),
  }));
};

export const checkUserExists = async (email: string): Promise<boolean> => {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  return existingUser.length > 0;
};

export const createNewUser = async (userData: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'instructor' | 'student';
  city?: string;
}) => {
  // Validate required fields
  if (!userData.email || !userData.firstName || !userData.lastName || !userData.role) {
    throw new Error('Missing required fields: email, firstName, lastName, and role are required');
  }

  const bcrypt = await import('bcryptjs');
  const defaultPassword = 'TempPassword123!';
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  const [newUser] = await db
    .insert(users)
    .values({
      email: userData.email.toLowerCase().trim(), // Normalize email
      passwordHash,
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      phone: userData.phone?.trim() || null,
      role: userData.role,
      city: userData.city?.trim() || null,
      isActive: true,
      isEmailVerified: false,
    })
    .returning();

  // Return user without password hash but with computed name
  const { passwordHash: _, ...userWithoutPassword } = newUser;
  return {
    ...userWithoutPassword,
    name: `${userWithoutPassword.firstName} ${userWithoutPassword.lastName}`.trim(),
  };
};