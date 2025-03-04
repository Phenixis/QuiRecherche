"use server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
});

export async function addProductAndDefaultPrice(previousState, formData) {
    const { name, price, currency } = Array.from(formData.entries()).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});

    if (!name || !price || !currency) {
        return {
            error: 'Please fill out all fields',
        };
    }

    const productResponse = await addProduct(name, (formData.get("description") != "" ? formData.get("description") : undefined));

    if (!productResponse.productId) {
        return productResponse;
    }

    const interval = formData.get("interval");
    const trial_period_days = parseInt(formData.get("trial_period_days"));

    const priceResponse = await addPrice(productResponse.productId, parseInt(price) * 100, currency, (interval && interval !== "one-time" ? interval : undefined), (trial_period_days && !isNaN(trial_period_days) ? trial_period_days : undefined));

    if (priceResponse.error) {
        return priceResponse;
    }

    await editProduct(productResponse.productId, name, (formData.get("description") != "" ? formData.get("description") : undefined), priceResponse.priceId);

    return {
        success: 'Product and price added successfully',
    };
}

export async function editProductAndDefaultPrice(previousState, formData) {
    const { name, price, currency } = Array.from(formData.entries()).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});

    if (!name || !price || !currency) {
        return {
            error: 'Please fill out all fields',
        };
    }

    const productResponse = await editProduct(formData.get("productId"), name, (formData.get("description") != "" ? formData.get("description") : undefined), formData.get("priceId"));

    if (!productResponse.productId) {
        return productResponse;
    }

    const interval = formData.get("interval");
    const trial_period_days = parseInt(formData.get("trial_period_days"));

    const priceResponse = await addPrice(productResponse.productId, parseInt(price) * 100, currency, (interval && interval !== "one-time" ? interval : undefined), (trial_period_days && !isNaN(trial_period_days) ? trial_period_days : undefined));

    if (priceResponse.error) {
        return priceResponse;
    }
    
    const productStatusResponse = await editProduct(productResponse.productId, name, (formData.get("description") != "" ? formData.get("description") : undefined), priceResponse.priceId);

    if (productStatusResponse.error) {
        return productStatusResponse
    }

    const priceStatusResponse = await togglePriceStatus(formData.get("priceId"), true);

    if (priceStatusResponse.error) {
        return priceStatusResponse;
    }

    if (formData.get("migrate") === "on") {
        const migrateResponse = await migrateSubscriptions(formData.get("productId"), priceResponse.priceId);

        if (migrateResponse.error) {
            return migrateResponse;
        }
    }

    return {
        success: 'Price updated successfully',
    };
}

export async function migrateSubscriptions(productId, priceId) {
    try {

        const subscriptions = await stripe.subscriptions.list();
        
        subscriptions.data.forEach(async subscription => {
            if (subscription.items.data[0].price.product === productId) {
                await stripe.subscriptions.update(subscription.id, {
                    items: [{
                        id: subscription.items.data[0].id,
                        price: priceId,
                    }],
                });
            }
        });

        return {
            success: 'Subscriptions migrated successfully',
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function addProduct(name, description) {
    try {
        const product = await stripe.products.create({
            name: name,
            description: description,
            active: true,
        });

        return {
            success: 'Product added successfully',
            productId: product.id,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function addPrice(productId, price, currency, interval, trial_period_days) {

    const priceData = {
        product: productId,
        unit_amount: price,
        currency: currency,
    };

    if (interval) {
        priceData.recurring = {
            interval: interval,
            trial_period_days: trial_period_days,
        };
    }

    try {
        const result = await stripe.prices.create(priceData);

        return {
            success: 'Price added successfully',
            priceId: result.id,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function editProduct(productId, name, description, defaultPriceId) {
    try {
        await stripe.products.update(productId, {
            name: name,
            description: description,
            default_price: defaultPriceId,
        });

        return {
            success: 'Product updated successfully',
            productId: productId,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function togglePriceStatus(priceId, actualState) {
    try {
        const result = await stripe.prices.update(priceId, {
            active: !actualState,
        });

        return {
            success: 'Price status updated successfully',
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function toggleProductStatus(productId, actualState) {
    try {
        const products = await stripe.products.list();

        let nbActiveProducts = 0;
        products.data.forEach(product => {
            if (product.active) {
                nbActiveProducts++;
            }
        });

        if (nbActiveProducts === 1 && actualState) {
            return {
                error: 'You cannot deactivate the only active product',
            };
        }

        await stripe.products.update(productId, {
            active: !actualState,
        });

        return {
            success: 'Product status updated successfully',
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}