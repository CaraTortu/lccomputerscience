import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { env } from "~/env";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { sendPasswordResetEmail, sendVerificationEmail } from "../emails";
import * as bcrypt from "bcrypt-ts";
import { checkHash } from "./utils";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    advanced: {
        generateId: false,
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
        password: {
            hash: async (password) => {
                return await bcrypt
                    .genSalt(12)
                    .then((salt) => bcrypt.hash(password, salt));
            },
            verify: async ({ hash, password }) => {
                return await checkHash(password, hash);
            },
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

    plugins: [nextCookies(), admin()],
});

// Export types
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
