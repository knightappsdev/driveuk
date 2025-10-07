import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from './auth-service';

/**
 * Authentication middleware to protect routes
 */
export async function withAuth(
  request: NextRequest, 
  requiredRoles?: ('admin' | 'instructor' | 'student')[],
  requireEmailVerification: boolean = true
) {
  try {
    const user = await getCurrentUser();

    // Check if user is authenticated
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check email verification if required
    if (requireEmailVerification && !user.isEmailVerified) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }

    // Check role authorization if specified
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

/**
 * Middleware to redirect authenticated users away from auth pages
 */
export async function withGuest(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (user) {
      // Redirect based on user role and email verification
      let redirectPath = '/dashboard';
      
      if (!user.isEmailVerified) {
        redirectPath = '/verify-email';
      } else {
        switch (user.role) {
          case 'admin':
            redirectPath = '/admin';
            break;
          case 'instructor':
            redirectPath = '/instructor';
            break;
          case 'student':
            redirectPath = '/dashboard';
            break;
          default:
            redirectPath = '/dashboard';
        }
      }

      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();

  } catch (error) {
    console.error('Guest middleware error:', error);
    return NextResponse.next();
  }
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  return 'unknown';
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}