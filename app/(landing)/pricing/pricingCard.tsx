import { SubmitButton } from './submit-button';
import { checkoutAction } from '@/lib/payments/actions';
import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';

export default function PricingCard({
    name,
    price,
    currency,
    interval,
    trialDays,
    features,
    priceId,
}: {
    name: string;
    price: number;
    currency: string;
    interval: string;
    trialDays: number;
    features: string[];
    priceId?: string;
}) {
    return (
        <Card className="flex flex-col justify-between">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <p className="text-4xl font-medium text-nowrap text-gray-900 dark:text-gray-100 mb-6">
                    {
                        currency === 'usd' ? '$' : currency === 'gbp' ? '£' : ''
                    }
                    {price / 100}
                    {
                        currency === 'eur' ? '€' : ''
                    }
                    {' '}
                    <span className="text-xl font-normal text-gray-600">
                        per {interval === 'one-time' ? 'lifetime' : interval}
                    </span>
                </p>
            </CardHeader>
            <CardContent>
                {
                    trialDays > 0 && (
                        <p className="text-sm text-gray-600 mb-4">
                            with {trialDays} day free trial
                        </p>
                    )
                }
                <ul className="space-y-4 mb-8">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <form action={checkoutAction} className="w-full">
                    <input type="hidden" name="priceId" value={priceId} />
                    <SubmitButton />
                </form>
            </CardFooter>
        </Card>
    )
}
