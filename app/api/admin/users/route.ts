import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users, type NewUser } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { hashPassword } from '@/lib/auth/session';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password must be less than 100 characters'),
  role: z.enum(['admin', 'instructor', 'student'], { required_error: 'Role is required' }),
  phone: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
});

// updateUserSchema moved to individual user route

// GET: Fetch all users
export async function GET() {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all users with basic information
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        phone: users.phone,
        avatar: users.avatar,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json(allUsers);

  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST: Create new user
export async function POST(request: NextRequest) {
  try {
    const user = await validateApiAccess('admin');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Check if email already exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Create new user
    const newUser: NewUser = {
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
      role: validatedData.role,
      phone: validatedData.phone || null,
      avatar: validatedData.avatar || null,
      isActive: true,
    };

    const [createdUser] = await db
      .insert(users)
      .values(newUser)
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        phone: users.phone,
        avatar: users.avatar,
        createdAt: users.createdAt,
      });

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: createdUser 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('User creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}