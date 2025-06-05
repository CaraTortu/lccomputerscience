import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses } from "~/server/db/schema";

export default async function CourseMiddleware({ params, children }: { params: { courseId: string }, children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect("/login")
    }

    const userTier = session.user.tier

    // Get module
    const { courseId } = params

    const courseModule = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        columns: {
            free: true
        }
    })

    if (!courseModule) {
        notFound()
    }

    if (userTier === "free" && !courseModule.free) {
        redirect("/pricing")
    }

    return children
}
