'use client';

import { usePathname } from 'next/navigation';
import Header from './header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Define routes where the landing page header should NOT be shown
  const hiddenHeaderRoutes = [
    '/admin',
    '/instructor',
    '/dashboard',
    '/profile',
    '/messages',
    '/unauthorized'
  ];
  
  // Check if current path starts with any of the hidden header routes
  const shouldHideHeader = hiddenHeaderRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Don't render header on dashboard/admin/instructor pages
  if (shouldHideHeader) {
    return null;
  }
  
  // Render header for landing page and public routes
  return <Header />;
}