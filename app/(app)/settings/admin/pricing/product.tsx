import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { StripeProductWithPrices } from '@/lib/payments/stripe';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import ToggleProduct from './toggleProduct';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import ProductDialog from './productDialog';
import { Check } from 'lucide-react';

export default function Product({
    product
}: {
    product?: StripeProductWithPrices;
}) {
    return (
        <Card className="flex flex-col justify-between">
            <CardHeader>
                {
                    product ? (
                        <CardTitle className="flex justify-between items-center">
                            {product.name}
                            <ToggleProduct productId={product.id} initialStatus={product.active} />
                        </CardTitle>
                    ) : (
                        <CardTitle className="flex justify-between items-center">
                            <Skeleton className="h-8 w-32" />
                            <Badge variant="outline" className="animate-pulse">
                                Loading...
                            </Badge>
                        </CardTitle>
                    )
                }
            </CardHeader>
            <CardContent>
                {
                    product ? (
                        <ul className={`grid ${(product.description || "").split("\n").length > 1 ? "grid-cols-2" : "grid-cols-1"
                            }`}>
                            {(product.description || "").split("\n").map((feature, index) => (
                                <li key={index} className="flex items-center mb-2">
                                    <Check className="size-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <>
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-4 w-1/2" />
                        </>
                    )
                }
                <Table>
                    <TableHeader>
                        <TableRow className={`${product ? "" : "animate-pulse"}`}>
                            <TableHead>Price</TableHead>
                            <TableHead>Interval</TableHead>
                            <TableHead>Trial Period</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            product ? product.prices.map(price => (
                                <TableRow key={price.id}>
                                    <TableCell>
                                        {
                                            price.unitAmount ? (
                                                `${price.currency === 'usd' ? '$' : price.currency === 'gbp' ? '£' : ''}${(price.unitAmount / 100).toFixed(2)}${price.currency === 'eur' ? '€' : ''}`
                                            ) : "Free"
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {price.interval}
                                    </TableCell>
                                    <TableCell>
                                        {price.trialPeriodDays} days
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <Skeleton className="h-4" />
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
                {
                    product && (
                        <ProductDialog productId={product.id} priceId={product.defaultPriceId} name={product.name} description={product.description} currency={product.prices[0].currency} price={product.prices[0].unitAmount || 0} interval={product.prices[0].interval} trial_period_days={product.prices[0].trialPeriodDays || 0} />
                    )
                }
            </CardFooter>
        </Card >
    )
}