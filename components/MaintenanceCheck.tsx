'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface MaintenanceCheckProps {
  children: React.ReactNode;
}

export default function MaintenanceCheck({ children }: MaintenanceCheckProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Don't check maintenance mode for these paths
  const excludedPaths = [
    '/maintenance',
    '/login',
    '/api',
    '/_next',
    '/favicon',
  ];

  const shouldCheckMaintenance = !excludedPaths.some(path => 
    pathname.startsWith(path)
  );

  useEffect(() => {
    if (!shouldCheckMaintenance) {
      setIsLoading(false);
      return;
    }

    const checkMaintenanceMode = async () => {
      try {
        const response = await fetch('/api/admin/settings/maintenance-status');
        if (response.ok) {
          const { maintenanceMode } = await response.json();
          
          if (maintenanceMode) {
            // Check if user is admin
            const userResponse = await fetch('/api/user/profile');
            if (userResponse.ok) {
              const userData = await userResponse.json();
              if (userData.role !== 'admin') {
                router.push('/maintenance');
                return;
              }
            } else {
              // Not authenticated or not admin, redirect to maintenance
              router.push('/maintenance');
              return;
            }
          }
          
          setIsMaintenanceMode(maintenanceMode);
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkMaintenanceMode();
  }, [router, pathname, shouldCheckMaintenance]);

  if (shouldCheckMaintenance && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}