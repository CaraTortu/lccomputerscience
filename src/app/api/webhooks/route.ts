import { type NextRequest } from "next/server";
import Stripe from "stripe";
import { env } from "~/env";
import { stripe } from "~/server/stripe";
import {
    createOrUpdatePrice,
    createOrUpdateProduct,
    deletePrice,
    deleteProduct,
    updateSubscriptionStatus,
} from "~/server/stripe/handlers";

const relevantEvents = new Set([
    "product.created",
    "product.updated",
    "product.deleted",
    "price.created",
    "price.updated",
    "price.deleted",
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
]);

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
        return new Response("Webhook secret not found", { status: 400 });
    }

    // Build the stripe event
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err) {
        if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
            return new Response(`Webhook Error: ${err.message}`, {
                status: 400,
            });
        }
        return new Response("Webhook Error", { status: 400 });
    }

    if (!relevantEvents.has(event.type)) {
        return new Response(`Unsupported event: ${event.type}`, {
            status: 400,
        });
    }

    // Handle the event
    switch (event.type) {
        // Product events
        case "product.created":
        case "product.updated":
            await createOrUpdateProduct(event.data.object);
            break;

        case "product.deleted":
            await deleteProduct(event.data.object);
            break;

        // Price events
        case "price.created":
        case "price.updated":
            await createOrUpdatePrice(event.data.object);
            break;

        case "price.deleted":
            await deletePrice(event.data.object);
            break;

        // Subscription events
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
            const subscription = event.data.object;
            await updateSubscriptionStatus(
                subscription.id,
                subscription.customer as string,
                event.type === "customer.subscription.created",
            );
            break;

        // Checkout events
        case "checkout.session.completed":
            const checkoutSession = event.data.object;
            if (checkoutSession.mode === "subscription") {
                await updateSubscriptionStatus(
                    checkoutSession.subscription as string,
                    checkoutSession.customer as string,
                    true,
                );
            }
            break;

        default:
            throw new Error(`Event type not handled: ${event.type}`);
    }

    return Response.json({ received: true });
}
