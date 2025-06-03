import { stripeClient } from "~/server/auth";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const stripeRouter = createTRPCRouter({
    getBillingPortalUrl: protectedProcedure
        .input(
            z.object({
                returnUrl: z.string().url().optional(),
            }),
        )
        .mutation(async ({ ctx: { session }, input }) => {
            const stripeCustomerId = session.user.stripeCustomerId;

            if (!stripeCustomerId) {
                return {
                    success: false,
                    reason: "No stripe customer ID found for this user",
                };
            }

            try {
                const { url } =
                    await stripeClient.billingPortal.sessions.create({
                        customer: stripeCustomerId,
                        return_url: input.returnUrl,
                    });

                return { success: true, url };
            } catch {
                return {
                    success: false,
                    reason: "Could not create billing portal session",
                };
            }
        }),
});
