import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { contactRouter } from "./routers/contact";
import { courseRouter } from "./routers/course";
import { adminRouter } from "./routers/admin";
import { userRouter } from "./routers/user";
import { stripeRouter } from "./routers/stripe";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    user: userRouter,
    admin: adminRouter,
    course: courseRouter,
    contact: contactRouter,
    stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
