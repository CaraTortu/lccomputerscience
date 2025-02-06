import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { eq } from "drizzle-orm";
import { courses, modules, user } from "~/server/db/schema";
import {
    createCourseSchema,
    createModuleSchema,
    updateCourseSchema,
    updateModuleSchema,
    updateUserSchema,
} from "~/lib/schemas";

export const adminRouter = createTRPCRouter({
    /**
     * USER MANAGEMENT
     */
    getUsers: adminProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.user.findMany();
    }),

    /**
     * COURSE MANAGEMENT
     */
    getCourses: adminProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.courses
            .findMany({
                with: { enrolledUsers: true },
            })
            .then((courses) =>
                courses.map((course) => ({
                    ...course,
                    enrolledUsers: course.enrolledUsers.length,
                })),
            );
    }),
    deleteCourse: adminProcedure
        .input(z.object({ courseId: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db
                .delete(courses)
                .where(eq(courses.id, input.courseId))
                .returning({ id: courses.id });

            return { success: result.length > 0 };
        }),

    updateCourse: adminProcedure
        .input(updateCourseSchema)
        .mutation(async ({ input, ctx }) => {
            const course = await ctx.db.query.courses.findFirst({
                where: eq(courses.id, input.id),
            });

            if (!course) {
                return { success: false, reason: "Course not found" };
            }

            await ctx.db
                .update(courses)
                .set({
                    name: input.name,
                    description: input.description,
                    status: input.status,
                    image: input.image,
                })
                .where(eq(courses.id, input.id))
                .execute();

            return { success: true };
        }),
    createCourse: adminProcedure
        .input(createCourseSchema)
        .mutation(async ({ input, ctx }) => {
            const result = await ctx.db
                .insert(courses)
                .values({
                    name: input.name,
                    description: input.description,
                    status: input.status,
                    image: input.image,
                })
                .returning();

            return { success: result.length > 0 };
        }),

    /**
     * MODULE MANAGEMENT
     */

    getModules: adminProcedure
        .input(z.object({ courseId: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const course = await ctx.db.query.courses.findFirst({
                where: eq(courses.id, input.courseId),
                with: { modules: true },
            });

            if (!course) {
                return { success: false, reason: "Course not found" };
            }

            return { success: true, data: course.modules };
        }),
    deleteModule: adminProcedure
        .input(z.object({ moduleId: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db
                .delete(modules)
                .where(eq(modules.id, input.moduleId))
                .returning({ id: modules.id });

            return { success: result.length > 0 };
        }),
    createModule: adminProcedure
        .input(createModuleSchema)
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db
                .insert(modules)
                .values({
                    name: input.name,
                    description: input.description,
                    courseId: input.courseId,
                })
                .returning();

            return { success: result.length > 0 };
        }),

    updateModule: adminProcedure
        .input(updateModuleSchema)
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db
                .update(modules)
                .set({
                    name: input.name,
                    description: input.description,
                })
                .where(eq(modules.id, input.id))
                .returning();

            return { success: result.length > 0 };
        }),

    /**
     * USER MANAGEMENT
     */
    updateUser: adminProcedure
        .input(updateUserSchema)
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db
                .update(user)
                .set({
                    name: input.name,
                    email: input.email,
                    image: input.image,
                    emailVerified: input.emailVerified,
                    tier: input.tier,
                    role: input.role,
                })
                .where(eq(user.id, input.id))
                .returning();

            return { success: result.length > 0 };
        }),
});
