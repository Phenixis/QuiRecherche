import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import PricingCard from './pricingCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
};

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(true),
    getStripeProducts(true),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className={`grid ${
        products.length > 2 ? 'md:grid-cols-3' : products.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'
      } gap-8 max-w-4xl mx-auto grid-cols-1`}>
        {prices.sort((a, b) => (a.unitAmount || 0) - (b.unitAmount || 0)).map((price) => {
          const product = products.find(
            (product) => product.id === price.productId
          );

          if (!product) {
            return null;
          }

          return (
            <PricingCard
              key={price.id}
              name={product.name}
              price={price.unitAmount || 0}
              currency={price.currency}
              interval={price.interval}
              trialDays={price.trialPeriodDays}
              features={product.description?.split('\n') || []}
              priceId={price.id}
            />
          );
        })}
      </div>
    </main>
  );
}