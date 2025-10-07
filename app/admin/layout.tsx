import AdminSidebar from '@/components/admin/admin-sidebar';
import AdminHeader from '@/components/admin/admin-header';

// Temporary mock user for demo purposes
const mockAdminUser = {
  id: 1,
  email: 'admin@driveuk.com',
  passwordHash: '',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin' as const,
  phone: '+44 7700 900123',
  city: 'London',
  isActive: true,
  isEmailVerified: true,
  isPhoneVerified: false,
  isBlocked: false,
  emailVerifiedAt: null,
  phoneVerifiedAt: null,
  lastLoginAt: null,
  registrationIp: null,
  lastLoginIp: null,
  profilePicture: null,
  timezone: 'Europe/London',
  locale: 'en-GB',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = mockAdminUser;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader user={user} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}