import { db } from './drizzle';
import { users } from './schema';
import { eq } from 'drizzle-orm';

export async function getUser(userId?: number) {
  if (!userId) {
    return null;
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}