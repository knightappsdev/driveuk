'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X } from 'lucide-react';
import ProfilePhoto from './components/ProfilePhoto';
import AccountStatus from './components/AccountStatus';
import PersonalInfo from './components/PersonalInfo';
import AddressInfo from './components/AddressInfo';
import EmergencyContact from './components/EmergencyContact';
import RoleSpecificInfo from './components/RoleSpecificInfo';
import { UserData } from './components/types';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (response.ok) {
        // Transform API data to match UserData interface
        const transformedData: UserData = {
          id: data.id,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email,
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth || '',
          address: data.address || '',
          postcode: data.postcode || '',
          city: data.city || '',
          emergencyContact: {
            name: data.emergencyContactName || '',
            phone: data.emergencyContactPhone || '',
            relationship: data.emergencyContactRelationship || ''
          },
          role: data.role,
          joinDate: data.createdAt,
          isEmailVerified: data.isEmailVerified,
          profilePicture: data.profilePicture
        };
        setUserData(transformedData);
      } else {
        console.error('Failed to fetch profile:', data.error);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!userData) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          dateOfBirth: userData.dateOfBirth,
          address: userData.address,
          postcode: userData.postcode,
          city: userData.city,
          emergencyContactName: userData.emergencyContact.name,
          emergencyContactPhone: userData.emergencyContact.phone,
          emergencyContactRelationship: userData.emergencyContact.relationship,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsEditing(false);
        console.log('Profile updated successfully');
        // Refresh profile data
        await fetchUserProfile();
      } else {
        console.error('Failed to update profile:', data.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Refresh data to reset any changes
    fetchUserProfile();
  };

  const handleUpdateField = (field: keyof UserData, value: any) => {
    setUserData(prev => prev ? ({
      ...prev,
      [field]: value
    }) : null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Manage your personal information and account settings
            </p>
          </div>
          
          {!isEditing ? (
            <Button onClick={handleEdit} className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <ProfilePhoto userData={userData} isEditing={isEditing} />
            <AccountStatus userData={userData} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <PersonalInfo 
              userData={userData} 
              isEditing={isEditing}
              onUpdateField={handleUpdateField}
            />
            <AddressInfo 
              userData={userData} 
              isEditing={isEditing}
              onUpdateField={handleUpdateField}
            />
            <EmergencyContact 
              userData={userData} 
              isEditing={isEditing}
              onUpdateField={handleUpdateField}
            />
            <RoleSpecificInfo 
              userData={userData} 
              isEditing={isEditing}
              onUpdateField={handleUpdateField}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
