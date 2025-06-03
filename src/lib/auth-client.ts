import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";
import { getBaseUrl } from "./utils";

export const authClient = createAuthClient({
    baseURL: getBaseUrl(),
    plugins: [
        adminClient(),
        stripeClient({
            subscription: true,
        }),
    ],
});
