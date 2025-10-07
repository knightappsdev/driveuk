import { cookies } from 'next/headers';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and, gte, desc } from 'drizzle-orm';
import { 
  users, 
  userSessions, 
  emailVerificationTokens, 
  passwordResetTokens, 
  loginAttempts,
  accountActivityLogs,
  students,
  instructors
} from '../db/schema';
import { hashPassword, verifyPassword } from './password';
import { createToken, verifyToken, generateSecureToken } from './jwt';
import { 
  AUTH_CONSTANTS, 
  UserSession, 
  RegisterInput, 
  LoginInput,
  type AuthResponse,
  type AuthError 
} from './types';

// Initialize database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}
const client = postgres(connectionString);
const db = drizzle(client);

/**
 * Register a new user
 */
export async function registerUser(input: RegisterInput, ipAddress?: string): Promise<AuthResponse | AuthError> {
  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        success: false,
        message: 'An account with this email already exists',
      };
    }

    // Hash the password
    const passwordHash = await hashPassword(input.password);

    // Create the user
    const [newUser] = await db
      .insert(users)
      .values({
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        role: input.role,
        city: input.city,
        registrationIp: ipAddress,
        timezone: 'Europe/London',
        locale: 'en-GB',
      })
      .returning();

    if (!newUser) {
      return {
        success: false,
        message: 'Failed to create user account',
      };
    }

    // Create role-specific profile
    if (input.role === 'student') {
      await db.insert(students).values({
        userId: newUser.id,
        dateOfBirth: input.dateOfBirth || undefined,
        address: input.address,
        postcode: input.postcode,
        licenseNumber: input.licenseNumber,
        emergencyContact: input.emergencyContact,
        previousDrivingExperience: input.previousDrivingExperience,
        learningGoals: input.learningGoals,
        preferredInstructorGender: input.preferredInstructorGender,
        medicalConditions: input.medicalConditions,
        preferredLanguage: 'english',
        drivingLevel: input.drivingLevel,
        startDate: input.startDate || undefined,
      });
    } else if (input.role === 'instructor') {
      await db.insert(instructors).values({
        userId: newUser.id,
        adiBadgeNumber: input.adiNumber || 'PENDING',
        adiGrade: input.adiGrade || 'trainee',
        yearsExperience: input.yearsExperience!,
        hourlyRate: input.hourlyRate!.toString(),
        specialties: input.specialties || [],
        instructorSummary: input.bio || 'Professional driving instructor',
        qualifications: input.qualifications || 'Qualified driving instructor',
        baseCity: input.city || 'London',
        businessAddress: input.address || 'TBD',
        businessPostcode: input.postcode || 'TBD',
        whatsappNumber: input.phone,
        availability: Array.isArray(input.availability) ? input.availability.join(',') : input.availability,
        vehicleDetails: input.vehicleDetails,
        transmissionTypes: input.teachingExpertise ? [input.teachingExpertise] : [],
        insuranceCompany: 'TBD',
        insurancePolicyNumber: 'TBD',
        carFuelType: 'petrol',
        vehicleRegistration: 'TBD',
        isActive: false, // Requires admin approval
        bio: input.bio,
        teachingExpertise: input.teachingExpertise,
        adiNumber: input.adiNumber,
      });
    }

    // Generate email verification token
    const verificationToken = generateSecureToken(32);
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.EMAIL_VERIFICATION_EXPIRY);

    await db.insert(emailVerificationTokens).values({
      userId: newUser.id,
      token: verificationToken,
      expiresAt,
    });

    // Log the activity
    await db.insert(accountActivityLogs).values({
      userId: newUser.id,
      activityType: 'account_created',
      description: `Account created for ${input.role}`,
      ipAddress,
    });

    // TODO: Send verification email
    console.log(`Verification token for ${input.email}: ${verificationToken}`);

    return {
      success: true,
      message: 'Account created successfully! Please check your email to verify your account.',
      redirectTo: '/verify-email?email=' + encodeURIComponent(input.email),
    };

  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'An error occurred during registration. Please try again.',
    };
  }
}

/**
 * Login user
 */
export async function loginUser(input: LoginInput, ipAddress?: string, userAgent?: string): Promise<AuthResponse | AuthError> {
  try {
    // Check for too many recent failed attempts
    const recentAttempts = await db
      .select()
      .from(loginAttempts)
      .where(
        and(
          eq(loginAttempts.email, input.email),
          eq(loginAttempts.isSuccessful, false),
          gte(loginAttempts.attemptedAt, new Date(Date.now() - AUTH_CONSTANTS.LOGIN_ATTEMPT_WINDOW))
        )
      );

    if (recentAttempts.length >= AUTH_CONSTANTS.MAX_LOGIN_ATTEMPTS) {
      return {
        success: false,
        message: 'Too many failed login attempts. Please try again in 15 minutes.',
      };
    }

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (!user) {
      // Log failed attempt
      await db.insert(loginAttempts).values({
        email: input.email,
        ipAddress: ipAddress || '',
        userAgent,
        isSuccessful: false,
        failureReason: 'user_not_found',
      });

      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(input.password, user.passwordHash);
    
    if (!isPasswordValid) {
      // Log failed attempt
      await db.insert(loginAttempts).values({
        email: input.email,
        ipAddress: ipAddress || '',
        userAgent,
        isSuccessful: false,
        failureReason: 'invalid_password',
        userId: user.id,
      });

      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    // Check if account is active
    if (!user.isActive || user.isBlocked) {
      return {
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      };
    }

    // Create session
    const sessionToken = generateSecureToken(64);
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.SESSION_DURATION * 1000);

    const [session] = await db
      .insert(userSessions)
      .values({
        userId: user.id,
        sessionToken,
        ipAddress: ipAddress || '',
        userAgent,
        expiresAt,
        deviceInfo: userAgent ? { userAgent } : undefined,
      })
      .returning();

    // Create JWT token
    const jwtToken = await createToken({
      userId: user.id,
      sessionId: session.id.toString(),
      email: user.email,
      role: user.role,
    });

    // Log successful attempt
    await db.insert(loginAttempts).values({
      email: input.email,
      ipAddress: ipAddress || '',
      userAgent,
      isSuccessful: true,
      userId: user.id,
      sessionId: session.id,
    });

    // Update last login
    await db
      .update(users)
      .set({ 
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      })
      .where(eq(users.id, user.id));

    // Log activity
    await db.insert(accountActivityLogs).values({
      userId: user.id,
      activityType: 'login',
      description: 'User logged in',
      ipAddress,
      userAgent,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(AUTH_CONSTANTS.COOKIE_NAME, jwtToken, AUTH_CONSTANTS.COOKIE_OPTIONS);

    const userSession: UserSession = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isEmailVerified: user.isEmailVerified ?? false,
      profilePicture: user.profilePicture || undefined,
      sessionId: session.id.toString(),
    };

    return {
      success: true,
      message: 'Login successful',
      user: userSession,
      redirectTo: getRedirectPath(user.role, user.isEmailVerified ?? false),
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An error occurred during login. Please try again.',
    };
  }
}

/**
 * Get current user from JWT token
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_CONSTANTS.COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    // Verify session exists and is active
    const [session] = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.id, parseInt(payload.sessionId)),
          eq(userSessions.isActive, true),
          gte(userSessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!session) {
      return null;
    }

    // Get user details
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.id, payload.userId),
          eq(users.isActive, true),
          eq(users.isBlocked, false)
        )
      )
      .limit(1);

    if (!user) {
      return null;
    }

    // Update session activity
    await db
      .update(userSessions)
      .set({ lastActivity: new Date() })
      .where(eq(userSessions.id, session.id));

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isEmailVerified: user.isEmailVerified ?? false,
      profilePicture: user.profilePicture || undefined,
      sessionId: payload.sessionId,
    };

  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Logout user
 */
export async function logoutUser(sessionId?: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_CONSTANTS.COOKIE_NAME)?.value;

    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        // Deactivate session
        await db
          .update(userSessions)
          .set({ 
            isActive: false,
            revokedAt: new Date(),
          })
          .where(eq(userSessions.id, parseInt(payload.sessionId)));

        // Log activity
        await db.insert(accountActivityLogs).values({
          userId: payload.userId,
          activityType: 'logout',
          description: 'User logged out',
        });
      }
    }

    // Clear cookie
    cookieStore.delete(AUTH_CONSTANTS.COOKIE_NAME);

  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Helper function to determine redirect path based on role and email verification
 */
function getRedirectPath(role: string, isEmailVerified: boolean): string {
  if (!isEmailVerified) {
    return '/verify-email';
  }

  switch (role) {
    case 'admin':
      return '/admin';
    case 'instructor':
      return '/instructor';
    case 'student':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}