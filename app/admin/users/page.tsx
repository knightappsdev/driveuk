'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import StatsCards from './StatsCards';
import SearchFilters from './SearchFilters';
import UsersTable from './UsersTable';
import UserModal, { UserFormData } from './UserModal';
import UserDetailsModal from './UserDetailsModal';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { ApiUser } from './types';
import { fetchUsers, filterUsers, deleteUser, toggleUserStatus, createUser, updateUser } from './utils';

export default function UsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = filterUsers(users, searchTerm, selectedRole, selectedStatus);

  const handleViewDetails = (user: ApiUser) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleEditUser = (user: ApiUser) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    try {
      await deleteUser(selectedUser.id);
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      alert('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(error.message || 'Error deleting user');
    } finally {
      setIsDeleting(false);
    }
  };  const handleToggleStatus = async (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const action = user.isActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} ${user.name}?`)) {
      return;
    }

    try {
      await toggleUserStatus(userId);
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      ));
      alert(`User ${action}d successfully`);
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      alert(error.message || `Error ${action.slice(0, -1)}ing user`);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (userData: UserFormData) => {
    setIsSaving(true);
    try {
      if (isEditing && selectedUser) {
        // Update existing user
        const updatedUser = await updateUser(selectedUser.id, {
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          role: userData.role,
          city: userData.city,
        });

        if (updatedUser) {
          setUsers(prev => prev.map(u => 
            u.id === selectedUser.id ? { 
              ...updatedUser, 
              name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim()
            } : u
          ));
          alert('User updated successfully!');
        }
      } else {
        // Create new user
        const newUser = await createUser(userData);
        if (newUser) {
          const userWithName = {
            ...newUser,
            name: `${newUser.firstName} ${newUser.lastName}`.trim()
          };
          setUsers(prev => [userWithName, ...prev]);
          alert('User created successfully!');
        }
      }
    } catch (error: any) {
      alert(error.message || 'Failed to save user');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage all users in the system
          </p>
        </div>
        <Button onClick={handleCreateUser} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <StatsCards users={users} />

      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <UsersTable
        users={filteredUsers}
        onViewDetails={handleViewDetails}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
      />

      {/* User Create/Edit Modal */}
      <UserModal
        open={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        user={isEditing ? selectedUser : null}
        onSave={handleSaveUser}
        isLoading={isSaving}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        user={selectedUser}
        onEdit={handleEditUser}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDeleteUser}
        isLoading={isDeleting}
      />
    </div>
  );
}
