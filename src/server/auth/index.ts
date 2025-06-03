import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { env } from "~/env";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { sendPasswordResetEmail, sendVerificationEmail } from "../emails";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";
import { getBaseUrl } from "~/lib/utils";
import Stripe from "stripe";
import { stripe } from "@better-auth/stripe";
import { type SubscriptionType } from "~/lib/types";

export const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
});

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    baseURL: getBaseUrl(),
    trustedOrigins: ["http://192.168.1.121:3000"],
    advanced: {
        database: {
            generateId: false,
        },
    },
    account: {
        accountLinking: {
            enabled: true,
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "user",
                input: false,
            },
            tier: {
                type: "string",
                required: true,
                defaultValue: "free",
                input: false,
            },
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }, _req) => {
            await sendVerificationEmail(user, url);
        },
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }, _req) => {
            await sendPasswordResetEmail(user, url);
        },
    },
    socialProviders: {
        google: {
            clientId: env.AUTH_GOOGLE_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET,
        },
    },
    databaseHooks: {
        session: {
            create: {
                after: async (session) => {
                    await db
                        .update(user)
                        .set({ lastLoginAt: new Date() })
                        .where(eq(user.id, session.userId))
                        .execute();
                },
            },
        },
    },

    plugins: [
        admin(),
        nextCookies(),
        stripe({
            stripeClient,
            stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
            createCustomerOnSignUp: true,
            subscription: {
                enabled: true,
                plans: async () => await db.query.stripePlans.findMany(),
                onSubscriptionComplete: async ({ subscription, plan }) => {
                    // Update tier for the user
                    await db
                        .update(user)
                        .set({ tier: plan.name as SubscriptionType })
                        .where(
                            eq(
                                user.stripeCustomerId,
                                subscription.stripeCustomerId!,
                            ),
                        );
                },
                onSubscriptionCancel: async ({ subscription }) => {
                    // Set users tier to free
                    await db
                        .update(user)
                        .set({ tier: "free" })
                        .where(
                            eq(
                                user.stripeCustomerId,
                                subscription.stripeCustomerId!,
                            ),
                        );
                },
            },
        }),
    ],
});

// Export types
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
