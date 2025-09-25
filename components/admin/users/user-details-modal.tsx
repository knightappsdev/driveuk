'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  X, 
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Image,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  isActive: boolean;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const roleColors = {
  admin: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  instructor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  student: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
};

export default function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            User Details
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling!.classList.remove('hidden');
                  }}
                />
              ) : null}
              <span className={`text-xl font-medium text-gray-700 dark:text-gray-300 ${user.avatar ? 'hidden' : ''}`}>
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={roleColors[user.role]}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                <Badge variant={user.isActive ? 'default' : 'secondary'} className="flex items-center gap-1">
                  {user.isActive ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Information
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Email:</span>
                <span className="text-sm text-gray-900 dark:text-white">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Phone:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Account Information
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">User ID:</span>
                <span className="text-sm text-gray-900 dark:text-white">#{user.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Role:</span>
                <Badge className={roleColors[user.role]}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Status:</span>
                <Badge variant={user.isActive ? 'default' : 'secondary'} className="flex items-center gap-1">
                  {user.isActive ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Avatar Information */}
          {user.avatar && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Image className="h-4 w-4" />
                Avatar
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="text-sm">
                  <span className="font-medium text-gray-600 dark:text-gray-300">URL: </span>
                  <a 
                    href={user.avatar} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {user.avatar}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Created:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Last Updated:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(user.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-4">
            <Button
              onClick={onClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}