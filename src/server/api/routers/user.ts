import { passwordVerificationSchema } from "~/lib/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { auth } from "~/server/auth";
export const userRouter = createTRPCRouter({
    setPassword: protectedProcedure
        .input(
            z.object({
                password: passwordVerificationSchema,
            }),
        )
        .mutation(async ({ input, ctx }) => {
            return await auth.api.setPassword({
                headers: ctx.headers,
                body: {
                    newPassword: input.password,
                },
            });
        }),
});
