import { StripeProductWithPrices } from "@/lib/payments/stripe"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Product from "./product";
import ProductDialog from "./productDialog";

export default function ProductsDisplay({
    products
} : {
    products?: StripeProductWithPrices[];
}) {
    return (
        (
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        Products
                        <ProductDialog />
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-8">
                    {
                        products ?
                        products.map(product => (
                            <Product key={product.id} product={product} />
                        )) : 
                        Array.from({ length: 1 }).map((_, i) => (
                            <Product key={i} />
                        ))
                    }
                </CardContent>
            </Card>
        )
    )
}