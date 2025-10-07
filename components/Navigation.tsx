'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
}

interface NavigationProps {
  user: User | null;
}

export default function Navigation({ user }: NavigationProps) {
  const pathname = usePathname();

  if (!user) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                DriveUK Pro
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/sign-in" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Get navigation items based on user role
  const getNavItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin', icon: '🏠' },
          { name: 'Users', href: '/admin/users', icon: '👥' },
          { name: 'Instructors', href: '/admin/instructors', icon: '👨‍🏫' },
          { name: 'Students', href: '/admin/students', icon: '👨‍🎓' },
          { name: 'Courses', href: '/admin/courses', icon: '📚' },
          { name: 'Theory Tests', href: '/admin/theory', icon: '🧠' },
          { name: 'Bookings', href: '/admin/bookings', icon: '📅' },
          { name: 'Analytics', href: '/admin/analytics', icon: '📊' },
          { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
        ];
      case 'instructor':
        return [
          { name: 'Dashboard', href: '/instructor', icon: '🏠' },
          { name: 'Bookings', href: '/instructor/bookings', icon: '📅' },
          { name: 'Lessons', href: '/instructor/lessons', icon: '🚗' },
          { name: 'Students', href: '/instructor/students', icon: '👨‍🎓' },
          { name: 'Theory Tests', href: '/theory', icon: '📖' },
          { name: 'Messages', href: '/instructor/messages', icon: '💬' },
        ];
      case 'student':
        return [
          { name: 'Dashboard', href: '/', icon: '🏠' },
          { name: 'Book Lesson', href: '/book', icon: '📅' },
          { name: 'My Lessons', href: '/lessons', icon: '🚗' },
          { name: 'Progress', href: '/progress', icon: '📈' },
          { name: 'Theory Test', href: '/theory', icon: '📖' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              DriveUK Pro
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    pathname === item.href
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Welcome, {user.name}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                user.role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
            
            <form action="/api/auth/sign-out" method="post">
              <button 
                type="submit"
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 text-base font-medium ${
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}