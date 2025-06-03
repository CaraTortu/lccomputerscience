import { db } from "~/server/db"
import { eq, not } from "drizzle-orm"
import { courses } from "~/server/db/schema"
import { CoursesGrid } from "~/app/_components/ui/landing/course-grid";

export default async function Content() {
    const content = await db.query.courses.findMany({
        where: not(eq(courses.status, "draft")),
    });

    return (
        <div className="grow flex flex-col w-full p-8 items-center">
            <div className="mb-8 max-w-7xl w-full flex flex-col gap-8">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">Our Courses</h1>
                    <p className="md:text-xl text-muted-foreground max-w-2xl">
                        Discover our comprehensive collection of courses designed to help you master modern web development
                        technologies.
                    </p>
                </div>
                <CoursesGrid courses={content} />
            </div>
        </div>
    )
}
