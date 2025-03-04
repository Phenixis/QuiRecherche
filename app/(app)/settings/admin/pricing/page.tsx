import Products from './products';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsDisplay from './productsDisplay';

export const metadata: Metadata = {
    title: 'Pricing',
    description: 'Manage your product pricing',
};

export default function PricingPage() {
    return (
        <section className="flex-1 p-4 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-lg lg:text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6">
                    Pricing
                </h1>
            </div>
            <Suspense fallback={<ProductsDisplay />}>
                <Products />
            </Suspense>
        </section>
    )
}