import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const fetchUserById = async (userId: number) => {
  const [user] = await db
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
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return null;

  // Add computed name field
  return {
    ...user,
    name: `${user.firstName} ${user.lastName}`.trim(),
  };
};

export const updateUser = async (userId: number, updateData: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  role?: 'admin' | 'instructor' | 'student';
}) => {
  // First check if user exists
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (existingUser.length === 0) {
    return null; // User not found
  }

  // Clean and validate update data
  const cleanedData: any = {};
  
  if (updateData.firstName !== undefined) {
    cleanedData.firstName = updateData.firstName.trim();
  }
  if (updateData.lastName !== undefined) {
    cleanedData.lastName = updateData.lastName.trim();
  }
  if (updateData.phone !== undefined) {
    cleanedData.phone = updateData.phone?.trim() || null;
  }
  if (updateData.city !== undefined) {
    cleanedData.city = updateData.city?.trim() || null;
  }
  if (updateData.role !== undefined) {
    cleanedData.role = updateData.role;
  }

  // Always update the timestamp
  cleanedData.updatedAt = new Date();

  const [updatedUser] = await db
    .update(users)
    .set(cleanedData)
    .where(eq(users.id, userId))
    .returning();

  // Return user with computed name field
  const { passwordHash: _, ...userWithoutPassword } = updatedUser;
  return {
    ...userWithoutPassword,
    name: `${userWithoutPassword.firstName} ${userWithoutPassword.lastName}`.trim(),
  };
};

export const deleteUser = async (userId: number) => {
  // First check if user exists
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (existingUser.length === 0) {
    return null; // User not found
  }

  // Delete the user
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning();

  return deletedUser;
};