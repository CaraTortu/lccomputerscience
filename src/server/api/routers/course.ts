import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
    courses,
    userCourseEnrollments,
    userLessonsComplete,
} from "~/server/db/schema";
import { and, eq, not } from "drizzle-orm";

export const courseRouter = createTRPCRouter({
    getCourse: publicProcedure
        .input(
            z.object({
                courseId: z.string().uuid(),
            }),
        )
        .query(async ({ input, ctx }) => {
            const course = await ctx.db.query.courses.findFirst({
                where: and(
                    eq(courses.id, input.courseId),
                    not(eq(courses.status, "draft")),
                ),
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
                modules: course.modules.map((m) => ({
                    ...m,
                    lessons: m.lessons.length,
                })),
                courseLength,
                students,
            };
        }),
    getCourseProgress: protectedProcedure
        .input(z.object({ courseId: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const course = await ctx.db.query.courses.findFirst({
                where: eq(courses.id, input.courseId),
                with: {
                    modules: {
                        with: {
                            lessons: true,
                        },
                    },
                },
            });

            if (!course || course.status === "draft") {
                return { success: false, reason: "Course not found" };
            }

            const userLessons = await ctx.db.query.userLessonsComplete.findMany(
                {
                    where: eq(userLessonsComplete.userId, ctx.session.user.id),
                },
            );

            const completedLessons = course.modules
                .flatMap((module) => module.lessons)
                .filter((lesson) =>
                    userLessons.some(
                        (userLesson) => userLesson.lessonId === lesson.id,
                    ),
                );

            const totalLessons = course.modules.flatMap(
                (module) => module.lessons,
            ).length;

            let progress = Math.round(
                (completedLessons.length / totalLessons) * 100,
            );

            if (isNaN(progress)) progress = 0;

            return { success: true, progress };
        }),
    getNextLesson: protectedProcedure
        .input(z.object({ courseId: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            // Get the course with its modules and lessons
            const course = await ctx.db.query.courses.findFirst({
                where: and(
                    eq(courses.id, input.courseId),
                    not(eq(courses.status, "draft")),
                ),
                with: {
                    modules: {
                        with: {
                            lessons: true,
                        },
                    },
                },
            });

            if (!course) {
                return { success: false, reason: "Course not found" };
            }

            const courseLessons = course.modules.flatMap(
                (module) => module.lessons,
            );

            // Make sure we have at least one lesson
            if (courseLessons.length === 0) {
                return { success: false, reason: "This course has no lessons" };
            }

            // Get lessons completed by the user
            const userCompletedLessons = await ctx.db.query.userLessonsComplete
                .findMany({
                    where: eq(userLessonsComplete.userId, ctx.session.user.id),
                    with: { lesson: true },
                })
                .then((lessons) => lessons.map((l) => l.lesson))
                .then((lessons) =>
                    lessons.filter((l) =>
                        courseLessons.some(
                            (courseLesson) => courseLesson.id === l.id,
                        ),
                    ),
                );

            // Find the next lesson
            const nextLesson =
                courseLessons.find(
                    (l) =>
                        !userCompletedLessons.some(
                            (userLesson) => userLesson.id === l.id,
                        ),
                ) ?? courseLessons[0]!;

            // Get lesson link
            const lessonLink = `/content/${input.courseId}/${nextLesson.moduleId}/${nextLesson.id}`;

            return { success: true, lesson: nextLesson, link: lessonLink };
        }),
    enrollUser: protectedProcedure
        .input(z.object({ courseId: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            // Check if the user is already enrolled
            const enrolled = await ctx.db.query.userCourseEnrollments.findFirst(
                {
                    where: and(
                        eq(userCourseEnrollments.userId, ctx.session.user.id),
                        eq(userCourseEnrollments.courseId, input.courseId),
                    ),
                },
            );

            // Enroll user in course
            if (!enrolled) {
                await ctx.db
                    .insert(userCourseEnrollments)
                    .values({
                        userId: ctx.session.user.id,
                        courseId: input.courseId,
                    })
                    .execute();

                return { success: true };
            }

            return { success: false, reason: "User is already enrolled" };
        }),
});
