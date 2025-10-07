'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Clock,
  MessageCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/instructor',
    icon: LayoutDashboard,
  },
  {
    name: 'My Students',
    href: '/instructor/students',
    icon: Users,
  },
  {
    name: 'Schedule',
    href: '/instructor/schedule',
    icon: Calendar,
  },
  {
    name: 'Lessons',
    href: '/instructor/lessons',
    icon: BookOpen,
  },
  {
    name: 'Bookings',
    href: '/instructor/bookings',
    icon: Clock,
  },
  {
    name: 'Messages',
    href: '/instructor/messages',
    icon: MessageCircle,
  },
  {
    name: 'Profile',
    href: '/instructor/profile',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/instructor/settings',
    icon: Settings,
  },
];

export default function InstructorSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DS</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                Instructor Panel
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white",
                  collapsed ? "justify-center" : "justify-start"
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={cn("w-5 h-5", collapsed ? "" : "mr-3")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              DriveSchool Pro v3.0
            </div>
          </div>
        )}
      </div>
    </div>
  );
}