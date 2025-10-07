'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Bell, LogOut, User as UserIcon, Settings } from 'lucide-react';
import ThemeControls from '@/components/theme-controls';
import { useRouter } from 'next/navigation';
import { users } from '@/lib/db/schema';
import { InferSelectModel } from 'drizzle-orm';

type User = InferSelectModel<typeof users>;

interface AdminHeaderProps {
  user: User;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // Successful logout - redirect to login page
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
        // Still redirect even if API call fails (fallback)
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error (fallback)
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      {/* Page Title - could be dynamic based on current page */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Administration Panel
        </h1>
      </div>

      {/* Right side - notifications, theme, user menu */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </Button>

        {/* Theme Controls */}
        <ThemeControls />

        {/* User Menu */}
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer size-8">
              <AvatarImage alt={`${user.firstName} ${user.lastName}`} src={user.profilePicture || undefined} />
              <AvatarFallback>
                {user.firstName[0] + (user.lastName ? user.lastName[0] : '')}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-medium text-foreground">
              <div className="flex flex-col space-y-1">
                <span className="truncate">{`${user.firstName} ${user.lastName}`}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full w-fit">
                  Administrator
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="w-full cursor-pointer text-red-600 dark:text-red-400"
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}