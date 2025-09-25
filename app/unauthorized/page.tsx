import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { getUser } from '@/lib/db/queries';
import { getDefaultRedirectPath } from '@/lib/auth/auth-helpers';

export default async function UnauthorizedPage() {
  const user = await getUser();
  const redirectPath = user ? getDefaultRedirectPath(user) : '/';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Access Denied
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {user ? (
              <p>
                You are logged in as <strong>{user.name}</strong> ({user.role}), 
                but don't have the required permissions for this area.
              </p>
            ) : (
              <p>
                Please sign in with an account that has the appropriate permissions.
              </p>
            )}
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href={redirectPath}>
                <Home className="w-4 h-4 mr-2" />
                Go to {user ? 'Dashboard' : 'Home'}
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="javascript:history.back()">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Link>
            </Button>
          </div>
          
          {!user && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="link" asChild className="w-full">
                <Link href="/auth/signin">
                  Sign in with different account
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}