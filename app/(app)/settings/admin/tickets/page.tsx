import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import Tickets from '@/components/big/tickets';
import TicketsDisplay from '@/components/big/ticketsDisplay';

export const metadata: Metadata = {
    title: 'Tickets',
};

export default function Page() {
    return (
        <section className="flex-1 p-4 lg:p-8">
            <h1 className="text-lg lg:text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6">
                Tickets
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<TicketsDisplay />}>
                        <Tickets admin />
                    </Suspense>
                </CardContent>
            </Card>
        </section>
    )
}