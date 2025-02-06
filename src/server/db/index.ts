import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";
import { type InferSelectModel } from "drizzle-orm";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
    conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });

// Export types
export type Tier = (typeof schema.userTierEnum.enumValues)[number];
export type UserType = (typeof schema.userTypeEnum.enumValues)[number];

export type StripeTier = (typeof schema.productTier.enumValues)[number];
export type StripeSubscriptionStatus =
    (typeof schema.stripeSubscriptionStatus.enumValues)[number];

export type DBUser = InferSelectModel<typeof schema.user>;
