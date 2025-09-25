import { requireAdmin } from '@/lib/auth/auth-helpers';
import AdminSidebar from '@/components/admin/admin-sidebar';
import AdminHeader from '@/components/admin/admin-header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

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