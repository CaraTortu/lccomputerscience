import { createTRPCRouter, publicProcedure } from "../trpc";
import { sendContactEmail } from "~/server/emails";
import { contactSchema } from "~/lib/schemas";

export const contactRouter = createTRPCRouter({
    contact: publicProcedure
        .input(contactSchema)
        .mutation(async ({ input }) => {
            // Send email
            return await sendContactEmail(
                input.name,
                input.email,
                input.message,
            );
        }),
});
