import { Metadata } from 'next';
import AdminTheoryManagement from '@/components/admin/theory-management';

export const metadata: Metadata = {
  title: 'Theory Test Management | Admin Dashboard',
  description: 'Manage DVSA theory test questions and categories',
};

export default function AdminTheoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminTheoryManagement />
      </div>
    </div>
  );
}