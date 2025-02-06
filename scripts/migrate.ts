import { db } from "~/server/db";
import admin from "firebase-admin";
import { env } from "~/env";
import {
    account,
    stripePrices,
    stripeProducts,
    stripeSubscriptions,
    user,
} from "~/server/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { stripe } from "~/server/stripe";
import {
    createOrUpdatePrice,
    createOrUpdateProduct,
    getOrCreateCustomer,
    updateSubscriptionStatus,
} from "~/server/stripe/handlers";

// Make sure the environment variables are set
if (!env.FIREBASE_PROJECT_ID) {
    throw new Error("Missing FIREBASE_PROJECT_ID");
}

if (!env.FIREBASE_CLIENT_EMAIL) {
    throw new Error("Missing FIREBASE_CLIENT_EMAIL");
}

if (!env.FIREBASE_PRIVATE_KEY) {
    throw new Error("Missing FIREBASE_PRIVATE_KEY");
}

if (!env.FIREBASE_DATABASE_URL) {
    throw new Error("Missing FIREBASE_DATABASE_URL");
}

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY,
    }),
    databaseURL: env.FIREBASE_DATABASE_URL,
});

const firebaseDb = admin.database();

const userSchema = z.object({
    Email: z.string().email(),
    Name: z.string(),
    Password: z.string(),
    Plan: z.enum(["bronze", "silver", "gold"]),
});

const metadataSchema = z.object({
    tier: z.enum(["bronze", "silver", "gold"]),
});

type UserType = z.infer<typeof userSchema>;
type UserRefVal = Record<string, UserType>;
type ProductMetadata = z.infer<typeof metadataSchema>;

// Migrate the data from Firebase to Postgres
async function getUsers() {
    const userRef = firebaseDb.ref("users");
    const firebaseUsers = (await userRef.once("value")).val() as UserRefVal;

    if (!firebaseUsers) {
        console.log("No users found");
        return;
    }

    const validUsers: UserType[] = [];

    for (const [id, firebaseUser] of Object.entries(firebaseUsers)) {
        const cleanUser: UserType = {
            Email: firebaseUser.Email,
            Name: firebaseUser.Name,
            Password: firebaseUser.Password,
            Plan: firebaseUser.Plan.toLowerCase() as UserType["Plan"],
        };

        // Validate the user
        const result = userSchema.safeParse(cleanUser);

        if (!result.success) {
            console.error(`Invalid user ${id} - skipping`);
            continue;
        }

        validUsers.push(result.data);

        // Make sure the user doesn't already exist
        const existingUser = await db.query.user.findFirst({
            where: eq(user.email, cleanUser.Email),
        });

        if (existingUser) {
            continue;
        }

        console.log(`Migrating user with firebase ID: ${id}`);

        // Create user
        const dbUser = await db
            .insert(user)
            .values({
                email: cleanUser.Email,
                name: cleanUser.Name,
                tier: cleanUser.Plan,
                emailVerified: true,
            })
            .returning({ id: user.id })
            .then((res) => res[0]!);

        // Create account
        await db.insert(account).values({
            userId: dbUser.id,
            providerId: "credential",
            accountId: crypto.randomUUID(),
            password: cleanUser.Password,
        });
    }
}

// Get products from stripe
async function getProducts() {
    const products = await stripe.products.list();
    const tiersFound: ProductMetadata["tier"][] = [];

    for (const product of products.data) {
        const result = metadataSchema.safeParse(product.metadata);

        if (!result.success) {
            continue;
        }

        const productTier = result.data.tier;

        if (tiersFound.includes(productTier)) {
            continue;
        }

        // Found product
        tiersFound.push(productTier);
        await createOrUpdateProduct(product);

        console.log(`Migrated product ${productTier}`);

        // Get the product prices
        const prices = await stripe.prices.search({
            query: `product:"${product.id}"`,
        });

        if (prices.data.length === 0) {
            console.error(`No price found for product ${productTier}`);
            continue;
        }

        if (!prices.data.some((price) => price.active === true)) {
            console.error(`No active price found for product ${productTier}`);
            continue;
        }

        for (const price of prices.data) {
            await createOrUpdatePrice(price);
        }
    }

    if (tiersFound.length !== 3) {
        throw new Error("Missing product tiers");
    }
}

// Create customers in stripe
async function createCustomers() {
    const users = await db.query.user.findMany();

    for (const user of users) {
        if (user.tier === "free") {
            continue;
        }

        // Check if the user already has a customer in the db
        const existingSubscription =
            await db.query.stripeSubscriptions.findFirst({
                where: eq(stripeSubscriptions.userId, user.id),
            });

        if (existingSubscription) {
            continue;
        }

        const customerId = await getOrCreateCustomer(user.id);

        if (!customerId) {
            console.error(
                `Failed to create or get customer for user ${user.id}`,
            );
            continue;
        }

        const product = await db.query.stripeProducts.findFirst({
            where: eq(stripeProducts.tier, user.tier),
            with: {
                prices: {
                    where: eq(stripePrices.active, true),
                },
            },
        });

        if (!product) {
            console.error(`Product not found for tier ${user.tier}`);
            continue;
        }

        if (product.prices.length === 0) {
            console.error(`No price found for product ${product.tier}`);
            continue;
        }

        const price = product.prices[0]!;

        // Check if there is a subscription
        let subscriptionId: string | null = null;
        const stripeSub = await stripe.subscriptions.search({
            query: `metadata["customerId"]:"${customerId}"`,
        });

        if (stripeSub.data.length > 0) {
            subscriptionId = stripeSub.data[0]!.id;
            console.log(`Subscription already exists for user ${user.id}`);
        } else {
            const subscription = await stripe.subscriptions.create({
                customer: customerId,
                items: [
                    {
                        price: price.id,
                    },
                ],
                trial_period_days: 365,
                trial_settings: {
                    end_behavior: {
                        missing_payment_method: "cancel",
                    },
                },
                metadata: {
                    customerId,
                },
            });

            subscriptionId = subscription.id;

            console.log(`Creating subscription for user ${user.id}`);
        }

        await updateSubscriptionStatus(subscriptionId, customerId, true);
    }
}

async function migrate() {
    await getUsers();

    try {
        await getProducts();
        await createCustomers();
    } catch (e) {
        console.error(e);
    }

    console.log("\n");
    console.log("Migration complete!");

    process.exit(0);
}

migrate().catch(console.error);
