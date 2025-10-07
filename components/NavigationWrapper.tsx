'use client';

import { useEffect, useState } from 'react';
import Navigation from './Navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
}

interface NavigationWrapperProps {
  initialUser: User | null;
}

export default function NavigationWrapper({ initialUser }: NavigationWrapperProps) {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    // Listen for authentication changes
    const handleAuthChange = async () => {
      // Fetch updated user data instead of reloading
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      }
    };

    // Listen for auth state changes
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  return <Navigation user={user} />;
}