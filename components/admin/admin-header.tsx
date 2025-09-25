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
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/db/schema';

interface AdminHeaderProps {
  user: User;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

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
              <AvatarImage alt={user.name || ''} src={user.avatar || undefined} />
              <AvatarFallback>
                {user.name ? user.name.split(' ').map((n) => n[0]).join('') : user.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-medium text-foreground">
              <div className="flex flex-col space-y-1">
                <span className="truncate">{user.name || 'Admin User'}</span>
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
            
            <form action={handleSignOut} className="w-full">
              <button type="submit" className="flex w-full">
                <DropdownMenuItem className="w-full flex-1 cursor-pointer text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}