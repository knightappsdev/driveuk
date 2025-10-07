'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose 
} from '@/components/ui/dialog';
import { ApiUser } from './types';
import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';

interface UserDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ApiUser | null;
  onEdit?: (user: ApiUser) => void;
}

export default function UserDetailsModal({ 
  open, 
  onOpenChange, 
  user,
  onEdit 
}: UserDetailsModalProps) {
  if (!user) return null;

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'instructor':
        return 'default';
      case 'student':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Details
              </div>
            </DialogTitle>
          </div>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* User Avatar and Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                <Badge variant={user.isActive ? 'default' : 'outline'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-900 dark:text-white">{user.email}</span>
            </div>

            {user.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900 dark:text-white">{user.phone}</span>
              </div>
            )}

            {user.city && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900 dark:text-white">{user.city}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-gray-900 dark:text-white">
                  Created: {formatDate(user.createdAt)}
                </div>
                {user.updatedAt && user.updatedAt !== user.createdAt && (
                  <div className="text-gray-500 text-xs mt-1">
                    Updated: {formatDate(user.updatedAt)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Account Information
            </h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>User ID:</span>
                <span className="font-mono text-xs">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={user.isActive ? 'text-green-600' : 'text-red-600'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Role:</span>
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          {onEdit && (
            <Button
              onClick={() => {
                onEdit(user);
                onOpenChange(false);
              }}
              variant="outline"
            >
              Edit User
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}