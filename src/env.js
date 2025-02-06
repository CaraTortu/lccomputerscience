import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        BETTER_AUTH_SECRET:
            process.env.NODE_ENV === "production"
                ? z.string()
                : z.string().optional(),
        AUTH_GOOGLE_ID: z.string(),
        AUTH_GOOGLE_SECRET: z.string(),
        DATABASE_URL: z.string().url(),

        EMAIL_SERVER: z.string(),
        EMAIL_PORT: z.string(),
        EMAIL_USERNAME: z.string(),
        EMAIL_PASSWORD: z.string(),

        CONTACT_EMAIL: z.string().email(),

        STRIPE_SECRET_KEY: z.string(),
        STRIPE_WEBHOOK_SECRET: z.string(),

        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),

        /* FIREBASE FOR MIGRATION */
        FIREBASE_PROJECT_ID: z.string().optional(),
        FIREBASE_PRIVATE_KEY: z.string().optional(),
        FIREBASE_CLIENT_EMAIL: z.string().optional(),
        FIREBASE_DATABASE_URL: z.string().optional(),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        NEXT_PUBLIC_URL: z.string().url(),
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
        AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
        DATABASE_URL: process.env.DATABASE_URL,
        EMAIL_SERVER: process.env.EMAIL_SERVER,
        EMAIL_PORT: process.env.EMAIL_PORT,
        EMAIL_USERNAME: process.env.EMAIL_USERNAME,
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
        NODE_ENV: process.env.NODE_ENV,
        CONTACT_EMAIL: process.env.CONTACT_EMAIL,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

        /* FIREBASE FOR MIGRATION */
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
        FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
        FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
     * useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    /**
     * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
     * `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,
});
