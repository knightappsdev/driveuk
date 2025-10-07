'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, BarChart3 } from 'lucide-react';
import { AdminStats, RevenueData, CoursePopularity } from './types';
import { 
  fetchAnalyticsStats, 
  generateMockRevenueData, 
  generateCoursePopularityData 
} from './utils';
import StatsCards from './StatsCards';
import AnalyticsCharts from './AnalyticsCharts';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [coursePopularity, setCoursePopularity] = useState<CoursePopularity[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    
    try {
      // Fetch stats
      const statsData = await fetchAnalyticsStats();
      setStats(statsData);

      // Generate mock revenue data for demo
      const mockRevenueData = generateMockRevenueData();
      setRevenueData(mockRevenueData);

      // Generate course popularity data
      const popularityData = await generateCoursePopularityData();
      setCoursePopularity(popularityData);

    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Monitor performance and track key metrics
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Monitor performance and track key metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={loadAnalytics}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      <StatsCards stats={stats} />

      <AnalyticsCharts 
        stats={stats}
        revenueData={revenueData}
        coursePopularity={coursePopularity}
      />
    </div>
  );
}
