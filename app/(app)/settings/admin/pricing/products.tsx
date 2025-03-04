import { getStripeProductsAndPrices} from "@/lib/payments/stripe"
import ProductsDisplay from "./productsDisplay";

export default async function Products() {
    const products = await getStripeProductsAndPrices();

    return (
        <ProductsDisplay products={products} />
    );
}