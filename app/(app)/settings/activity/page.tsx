import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import ActivityLogs from './activityLogs';
import ActivityLogsSkeleton from './activityLogsSkeleton';

export const metadata: Metadata = {
  title: 'Activity Logs',
};

export default async function ActivityPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6">
        Activity Logs
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ActivityLogsSkeleton />}>
            <ActivityLogs />
          </Suspense>
        </CardContent>
      </Card>
    </section>
  );
}
