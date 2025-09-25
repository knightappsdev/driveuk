import { requireInstructor } from '@/lib/auth/auth-helpers';
import InstructorSidebar from '@/components/instructor/instructor-sidebar';
import InstructorHeader from '@/components/instructor/instructor-header';

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireInstructor();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <InstructorSidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <InstructorHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}