import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { productTier, stripePrices, stripeProducts } from "~/server/db/schema";
import { getOrCreateCustomer } from "~/server/stripe/handlers";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { calculateTrialEndUnixTimestamp } from "~/lib/utils";
import { env } from "~/env";

export const stripeRouter = createTRPCRouter({
    createCheckoutSession: protectedProcedure
        .input(
            z.object({
                tier: z.enum(productTier.enumValues),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // Get the customer
            const customer = await getOrCreateCustomer(ctx.session.user.id);

            if (!customer) {
                return {
                    success: false,
                    reason: "Error creating customer.",
                };
            }

            // Get the product
            const product = await ctx.db.query.stripeProducts.findFirst({
                where: eq(stripeProducts.tier, input.tier),
                with: {
                    prices: {
                        where: eq(stripePrices.active, true),
                    },
                },
            });

            if (!product) {
                return {
                    success: false,
                    reason: "Product not found.",
                };
            }

            if (product.prices.length === 0) {
                return {
                    success: false,
                    reason: "Price not found. Please contact an admin",
                };
            }

            const productPrice = product.prices[0]!;

            // Create a checkout session
            let checkoutSessionParams: Stripe.Checkout.SessionCreateParams = {
                allow_promotion_codes: true,
                billing_address_collection: "required",
                customer,
                customer_update: {
                    address: "auto",
                },
                line_items: [
                    {
                        price: productPrice.id,
                        quantity: 1,
                    },
                ],
                cancel_url: `${env.NEXT_PUBLIC_URL}/pricing`,
                success_url: `${env.NEXT_PUBLIC_URL}/pricing`,
            };

            // Check for one off or recurring payment
            if (productPrice.type === "recurring") {
                checkoutSessionParams = {
                    ...checkoutSessionParams,
                    mode: "subscription",
                    subscription_data: {
                        trial_end: calculateTrialEndUnixTimestamp(
                            productPrice.trialPeriodDays,
                        ),
                        metadata: {
                            customerId: customer,
                        },
                    },
                };
            } else {
                checkoutSessionParams = {
                    ...checkoutSessionParams,
                    mode: "payment",
                };
            }

            // Create the session
            let session: Stripe.Checkout.Session;
            try {
                session = await ctx.stripe.checkout.sessions.create(
                    checkoutSessionParams,
                );
            } catch (err) {
                if (err instanceof Error) {
                    console.log(`[-] Error creating session: ${err.message}`);
                }

                return {
                    success: false,
                    reason: "Error creating session.",
                };
            }

            return {
                success: true,
                sessionId: session.id,
            };
        }),
    createPortalSession: protectedProcedure
        .input(z.object({ returnUrl: z.string().optional() }))
        .mutation(async ({ ctx, input }) => {
            // Get the customer
            const customer = await getOrCreateCustomer(ctx.session.user.id);

            if (!customer) {
                return {
                    success: false,
                    reason: "Error creating customer.",
                };
            }

            // Create a portal session
            let url: string;
            try {
                const portalSessionParams =
                    await ctx.stripe.billingPortal.sessions.create({
                        customer,
                        return_url: input.returnUrl,
                    });

                url = portalSessionParams.url;
            } catch (err) {
                if (err instanceof Error) {
                    console.log(
                        `[-] Error creating portal session: ${err.message}`,
                    );
                }

                return {
                    success: false,
                    reason: "Error creating portal session.",
                };
            }

            return {
                success: true,
                url,
            };
        }),
});
