'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MaintenanceToggleProps {
  initialValue?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export default function MaintenanceToggle({ initialValue = false, onToggle }: MaintenanceToggleProps) {
  const [isEnabled, setIsEnabled] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    checkMaintenanceStatus();
  }, []);

  const checkMaintenanceStatus = async () => {
    try {
      const response = await fetch('/api/maintenance/status');
      const data = await response.json();
      
      if (data.success) {
        setIsEnabled(data.data.isEnabled);
      }
    } catch (error) {
      console.error('Failed to check maintenance status:', error);
    }
  };

  const toggleMaintenance = async (enabled: boolean) => {
    setIsLoading(true);
    setStatus('idle');
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'maintenanceMode',
          value: enabled.toString(),
        }),
      });

      if (response.ok) {
        setIsEnabled(enabled);
        setStatus('success');
        onToggle?.(enabled);
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Failed to toggle maintenance mode:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshStatus = () => {
    checkMaintenanceStatus();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <span>Maintenance Mode</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isEnabled ? 'Site is under maintenance' : 'Site is operational'}
            </p>
            <p className="text-xs text-gray-500">
              {isEnabled 
                ? 'Only admins can access the site' 
                : 'All users can access the site normally'
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshStatus}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Switch
              checked={isEnabled}
              onCheckedChange={toggleMaintenance}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center space-x-2 text-sm">
          {isEnabled ? (
            <>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-orange-600">Maintenance mode active</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600">Site operational</span>
            </>
          )}
        </div>

        {/* Status messages */}
        {status === 'success' && (
          <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            <Shield className="w-4 h-4" />
            <span>Maintenance mode {isEnabled ? 'enabled' : 'disabled'} successfully</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <span>Failed to toggle maintenance mode. Please try again.</span>
          </div>
        )}

        {/* Warning message when enabled */}
        {isEnabled && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
              <div className="text-sm text-orange-700">
                <p className="font-medium">Warning: Site is under maintenance</p>
                <p className="mt-1">
                  All non-admin users will see the maintenance page. Make sure to disable 
                  maintenance mode when updates are complete.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}