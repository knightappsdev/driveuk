import RegisterForm from '@/components/auth/register-form';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Demo Credentials Info */}
      <div className="max-w-md mx-auto mb-8">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 text-sm">Demo Mode Available</h3>
              <p className="text-xs text-blue-700 mt-1">
                Skip registration and try the platform with demo accounts.{' '}
                <Link href="/sign-in" className="underline font-medium">
                  Sign in with demo credentials
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <RegisterForm />
    </div>
  );
}