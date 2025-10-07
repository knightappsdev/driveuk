'use client';

import { usePathname } from 'next/navigation';
import Header from './header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show header on admin, instructor, or authenticated user routes
  const hideHeader = pathname.startsWith('/admin') || 
                    pathname.startsWith('/instructor') || 
                    pathname.startsWith('/dashboard') ||
                    pathname.startsWith('/profile') ||
                    pathname.startsWith('/messages') ||
                    pathname.startsWith('/login') ||
                    pathname.startsWith('/register') ||
                    pathname.startsWith('/sign-in') ||
                    pathname.startsWith('/sign-up');

  if (hideHeader) {
    return null;
  }

  return <Header />;
}