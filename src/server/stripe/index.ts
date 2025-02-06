import Stripe from "stripe";
import { env } from "~/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    appInfo: {
        name: "LC Computer Science",
        version: "0.0.0",
        url: "https://lccomputerscience.com",
    },
});
