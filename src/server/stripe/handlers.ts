import { eq, type InferSelectModel } from "drizzle-orm";
import type Stripe from "stripe";
import {
    productTier,
    stripeCustomers,
    stripePrices,
    stripeProducts,
    stripeSubscriptions,
    user,
} from "../db/schema";
import { db, type StripeTier } from "../db";
import { stripe } from ".";
import { toDatetime } from "~/lib/utils";

export async function createOrUpdateProduct(product: Stripe.Product) {
    // Extract the product tier in the metadata
    const tier = product.metadata.tier;

    if (!tier) {
        console.log("[-] Product tier not found in metadata");
        return;
    }

    if (!productTier.enumValues.includes(tier as StripeTier)) {
        console.log("[-] Invalid product tier - ", tier);
        return;
    }

    const productData: InferSelectModel<typeof stripeProducts> = {
        id: product.id,
        tier: tier as StripeTier,
        name: product.name,
        description: product.description,
        active: product.active,
        metadata: product.metadata,
    };

    // Check if the product exists
    const existingProduct = await db.query.stripeProducts.findFirst({
        where: eq(stripeProducts.id, product.id),
    });

    if (existingProduct) {
        // Update the product
        await db
            .update(stripeProducts)
            .set(productData)
            .where(eq(stripeProducts.id, product.id));
    } else {
        // Create the product
        await db.insert(stripeProducts).values(productData);
    }
}

export async function deleteProduct(product: Stripe.Product) {
    // Delete the product
    const deleted = await db
        .delete(stripeProducts)
        .where(eq(stripeProducts.id, product.id))
        .returning({
            id: stripeProducts.id,
        });

    if (deleted.length === 0) {
        console.log(`[-] Product ${product.id} not found in the database`);
    }
}

export async function createOrUpdatePrice(price: Stripe.Price) {
    // Check if product exists for the price
    // This may happen because upon product creation, the metadata is necessary
    const product = await db.query.stripeProducts.findFirst({
        where: eq(stripeProducts.id, price.product as string),
    });

    if (!product) {
        console.log("[-] Product not found for price - ", price.id);
        return;
    }

    const stripePrice: InferSelectModel<typeof stripePrices> = {
        id: price.id,
        productId: price.product as string,
        active: price.active,
        description: price.nickname,
        unitAmount: price.unit_amount,
        currency: price.currency,
        metadata: price.metadata,
        type: price.type,
        interval: price.recurring?.interval ?? null,
        intervalCount: price.recurring?.interval_count ?? null,
        trialPeriodDays: price.recurring?.trial_period_days ?? null,
    };

    // Check if the price exists
    const existingPrice = await db.query.stripePrices.findFirst({
        where: eq(stripePrices.id, price.id),
    });

    if (existingPrice) {
        // Update the price
        await db
            .update(stripePrices)
            .set(stripePrice)
            .where(eq(stripePrices.id, price.id));
    } else {
        // Create the price
        await db.insert(stripePrices).values(stripePrice);
    }
}

export async function deletePrice(price: Stripe.Price) {
    // Delete the price
    const deleted = await db
        .delete(stripePrices)
        .where(eq(stripePrices.id, price.id))
        .returning({
            id: stripePrices.id,
        });

    if (deleted.length === 0) {
        console.log(`[-] Price ${price.id} not found in the database`);
    }
}

export async function copyBillingDetailsToCustomer(
    customerId: string,
    paymentMethod: Stripe.PaymentMethod,
) {
    const customer = paymentMethod.customer as string;
    const details = paymentMethod.billing_details;

    if (!details.address || !details.name) return;

    await stripe.customers.update(customer, {
        name: details.name,
        address: {
            line1: details.address.line1 ?? undefined,
            line2: details.address.line2 ?? undefined,
            city: details.address.city ?? undefined,
            state: details.address.state ?? undefined,
            postal_code: details.address.postal_code ?? undefined,
            country: details.address.country ?? undefined,
        },
    });

    // Update the customer in the database
    await db
        .update(stripeCustomers)
        .set({
            billingAddress: details.address,
            paymentMethod: paymentMethod[paymentMethod.type],
        })
        .where(eq(stripeCustomers.stripeCustomerId, customerId));
}

export async function updateSubscriptionStatus(
    subscriptionId: string,
    customerId: string,
    isNew = false,
) {
    // Get the customer
    const customer = await db.query.stripeCustomers.findFirst({
        where: eq(stripeCustomers.stripeCustomerId, customerId),
    });

    if (!customer) {
        console.log("[-] Customer not found - ", customerId);
        return;
    }

    // Get the subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ["default_payment_method"],
    });

    const subscriptionData: InferSelectModel<typeof stripeSubscriptions> = {
        id: subscription.id,
        userId: customer.userId,
        metadata: subscription.metadata,
        status: subscription.status,
        priceId: subscription.items.data[0]!.price.id,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        cancelAt: subscription.cancel_at
            ? toDatetime(subscription.cancel_at)
            : null,
        canceledAt: subscription.canceled_at
            ? toDatetime(subscription.canceled_at)
            : null,
        currentPeriodStart: toDatetime(subscription.current_period_start),
        currentPeriodEnd: toDatetime(subscription.current_period_end),
        trialStart: subscription.trial_start
            ? toDatetime(subscription.trial_start)
            : null,
        trialEnd: subscription.trial_end
            ? toDatetime(subscription.trial_end)
            : null,
        endedAt: subscription.ended_at
            ? toDatetime(subscription.ended_at)
            : null,
        created: toDatetime(subscription.created),
    };

    // Check if the subscription exists
    const existingSubscription = await db.query.stripeSubscriptions.findFirst({
        where: eq(stripeSubscriptions.id, subscription.id),
    });

    if (existingSubscription) {
        // Update the subscription
        await db
            .update(stripeSubscriptions)
            .set(subscriptionData)
            .where(eq(stripeSubscriptions.id, subscription.id));
    } else {
        // Create the subscription
        await db.insert(stripeSubscriptions).values(subscriptionData);
    }

    // Update the tier of the user
    if (subscription.status === "active") {
        const price = await db.query.stripePrices.findFirst({
            where: eq(stripePrices.id, subscriptionData.priceId),
            with: {
                product: true,
            },
        });

        if (!price) {
            console.log(
                "[-] Price not found for subscription - ",
                subscription.id,
            );
            return;
        }

        await db
            .update(user)
            .set({ tier: price.product.tier })
            .where(eq(user.id, customer.userId));
    } else if (subscription.status === "canceled") {
        // Remove the tier from the user
        await db
            .update(user)
            .set({ tier: "free" })
            .where(eq(user.id, customer.userId));
    }

    // Copy the billing details to the customer
    if (
        isNew &&
        subscription.default_payment_method &&
        customer.stripeCustomerId
    ) {
        await copyBillingDetailsToCustomer(
            customer.stripeCustomerId,
            subscription.default_payment_method as Stripe.PaymentMethod,
        );
    }
}

/**
 * Get or create a customer in Stripe.
 *
 * Returns the customer ID in stripe.
 */
export async function getOrCreateCustomer(userId: string) {
    // Get the user
    const dbUser = await db.query.user.findFirst({
        where: eq(user.id, userId),
    });

    if (!dbUser) {
        throw new Error("UNREACHABLE");
    }

    const customer = await db.query.stripeCustomers.findFirst({
        where: eq(stripeCustomers.userId, userId),
    });

    // Get the stripe customer ID
    let customerId: string | undefined;
    if (customer?.stripeCustomerId) {
        try {
            const stripeCustomer = await stripe.customers.retrieve(
                customer.stripeCustomerId,
            );

            customerId = stripeCustomer.id;
        } catch (e) {
            if (e instanceof Error) {
                customerId = undefined;
            }
        }
    } else {
        // Try to retrieve the customer by email
        const stripeCustomer = await stripe.customers.list({
            email: dbUser.email,
            limit: 1,
        });

        customerId =
            stripeCustomer.data.length > 0
                ? stripeCustomer.data[0]!.id
                : undefined;
    }

    // Create a new customer if no ID was found
    if (!customerId) {
        const stripeCustomer = await stripe.customers.create({
            email: dbUser.email,
            metadata: {
                userId: dbUser.id,
            },
        });

        if (!stripeCustomer) {
            console.log("[-] Error creating customer for user - ", dbUser.id);
            return;
        }

        customerId = stripeCustomer.id;
    }

    // We have the customer in the database and a matching stripe ID
    if (customer && customerId) {
        // If we did find a customer but the ID doesnt match, update the ID
        if (customer.stripeCustomerId !== customerId) {
            await db
                .update(stripeCustomers)
                .set({ stripeCustomerId: customerId })
                .where(eq(stripeCustomers.userId, userId));
        }

        return customerId;
    }

    // Create a new customer
    await db.insert(stripeCustomers).values({
        userId: dbUser.id,
        stripeCustomerId: customerId,
    });

    return customerId;
}
