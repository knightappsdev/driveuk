import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { AUTH_CONSTANTS } from '@/lib/auth/types';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookies
  const authToken = request.cookies.get(AUTH_CONSTANTS.COOKIE_NAME)?.value;
  
  // Define route patterns
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(pathname);
  const isProtectedRoute = ['/dashboard', '/admin', '/instructor', '/student'].some(route => 
    pathname.startsWith(route)
  );
  const isApiRoute = pathname.startsWith('/api');
  
  // Skip middleware for static files and some API routes
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon') || 
      pathname.includes('.') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/api/email') ||
      pathname.startsWith('/api/courses')) {
    return NextResponse.next();
  }

  // For now, we'll skip maintenance mode check in middleware
  // and handle it at the component level instead
  const isMaintenanceEnabled = false;
  
  let user = null;
  
  // Verify token if present
  if (authToken) {
    try {
      const payload = await verifyToken(authToken);
      if (payload) {
        user = payload;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      // Clear invalid token
      const response = NextResponse.next();
      response.cookies.delete(AUTH_CONSTANTS.COOKIE_NAME);
      return response;
    }
  }

  // Handle maintenance mode (after user verification)
  if (isMaintenanceEnabled) {
    // Allow admin users to bypass maintenance mode
    if (user?.role === 'admin') {
      // Admin can access the site normally
      return NextResponse.next();
    }
    
    // Allow access to the maintenance page itself
    if (pathname === '/maintenance') {
      return NextResponse.next();
    }
    
    // Allow admin login page so admins can log in during maintenance
    if (pathname === '/login' || pathname.startsWith('/api')) {
      return NextResponse.next();
    }
    
    // Redirect all other users to maintenance page
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // Handle authentication pages
  if (isAuthPage) {
    if (user) {
      // Redirect authenticated users away from auth pages
      let redirectPath = '/dashboard';
      
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
      }
      
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-based access control
    if (pathname.startsWith('/admin') && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    if (pathname.startsWith('/instructor') && user.role !== 'instructor') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Handle API routes that require authentication
  if (isApiRoute && !pathname.startsWith('/api/auth')) {
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
