import { type Stripe, loadStripe } from "@stripe/stripe-js";
import { env } from "~/env";

let stripe: Stripe | null = null;

export const getStripe = async () => {
    if (!stripe) {
        stripe = await loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    }

    return stripe;
};
