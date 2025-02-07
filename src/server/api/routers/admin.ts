import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { and, eq } from "drizzle-orm";
import {
    courses,
    lessons,
    modules,
    user,
    userCourseEnrollments,
} from "~/server/db/schema";
import {
    createCourseSchema,
    createLessonSchema,
    createModuleSchema,
    updateCourseSchema,
    updateLessonSchema,
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
    getCourse: adminProcedure
        .input(
            z.object({
                courseId: z.string().uuid(),
            }),
        )
        .query(async ({ input, ctx }) => {
            const course = await ctx.db.query.courses.findFirst({
                where: and(eq(courses.id, input.courseId)),
                with: {
                    modules: {
                        with: {
                            lessons: true,
                        },
                    },
                },
            });

            if (!course) {
                return null;
            }

            // Calculate course length
            const courseLength = course.modules.reduce(
                (acc, module) =>
                    acc +
                    module.lessons.reduce((accL, l) => accL + l.duration, 0),
                0,
            );

            // Get number of students enrolled
            const students = await ctx.db.query.userCourseEnrollments
                .findMany({
                    where: eq(userCourseEnrollments.courseId, course.id),
                })
                .then((enrollments) => enrollments.length);

            return {
                ...course,
                courseLength,
                students,
            };
        }),
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
     * LESSON MANAGEMENT
     */

    getLessons: adminProcedure
        .input(z.object({ moduleId: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const dbModule = await ctx.db.query.modules.findFirst({
                where: eq(modules.id, input.moduleId),
                with: { lessons: true },
            });

            if (!dbModule) {
                return { success: false, reason: "Module not found" };
            }

            return { success: true, data: dbModule.lessons };
        }),

    deleteLesson: adminProcedure
        .input(z.object({ lessonId: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db
                .delete(lessons)
                .where(eq(lessons.id, input.lessonId))
                .returning({ id: lessons.id });

            return { success: result.length > 0 };
        }),

    createLesson: adminProcedure
        .input(createLessonSchema)
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db
                .insert(lessons)
                .values({
                    name: input.name,
                    description: input.description,
                    duration: input.duration,
                    content: input.content,
                    videoUrl: input.videoUrl,
                    presentationUrl: input.presentationUrl,
                    moduleId: input.moduleId,
                })
                .returning();

            return { success: result.length > 0 };
        }),

    updateLesson: adminProcedure
        .input(updateLessonSchema)
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db
                .update(lessons)
                .set({
                    name: input.name,
                    description: input.description,
                    duration: input.duration,
                    content: input.content,
                    videoUrl: input.videoUrl,
                    presentationUrl: input.presentationUrl,
                })
                .where(eq(lessons.id, input.id))
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
