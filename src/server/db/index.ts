import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";
import {
    neon,
    neonConfig,
    type NeonQueryFunction,
    type WebSocketConstructor,
} from "@neondatabase/serverless";

import { env } from "~/env";
import * as schema from "./schema";
import { type InferSelectModel } from "drizzle-orm";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
    conn: NeonQueryFunction<false, false> | undefined;
};

const connectionString = env.NEON_DATABASE_URL;
if (
    env.NODE_ENV === "development" ||
    connectionString.includes("db.localtest.me")
) {
    neonConfig.fetchEndpoint = (host) => {
        const [protocol, port] =
            host === "db.localtest.me" ? ["http", 4444] : ["https", 443];
        return `${protocol}://${host}:${port}/sql`;
    };
    const connectionStringUrl = new URL(connectionString);
    neonConfig.useSecureWebSocket =
        connectionStringUrl.hostname !== "db.localtest.me";
    neonConfig.wsProxy = (host) =>
        host === "db.localtest.me" ? `${host}:4444/v2` : `${host}/v2`;
}
neonConfig.webSocketConstructor = ws as WebSocketConstructor;

const conn = globalForDb.conn ?? neon(connectionString);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle({ client: conn, schema });

// Export types
export type Tier = (typeof schema.userTierEnum.enumValues)[number];
export type UserType = (typeof schema.userTypeEnum.enumValues)[number];

export type DBUser = InferSelectModel<typeof schema.user>;
export type DBCourse = InferSelectModel<typeof schema.courses>;
export type DBModule = InferSelectModel<typeof schema.modules>;
export type DBLesson = InferSelectModel<typeof schema.lessons>;
