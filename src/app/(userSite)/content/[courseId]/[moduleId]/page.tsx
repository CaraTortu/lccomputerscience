import { eq } from "drizzle-orm";
import { ArrowLeft, CheckCircle, PlayCircle } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "~/app/_components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { Progress } from "~/app/_components/ui/progress";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { modules, userLessonsComplete } from "~/server/db/schema";

export default async function ModulePage({ params }: { params: Promise<{ courseId: string, moduleId: string }> }) {
    const courseId = (await params).courseId;
    const moduleId = (await params).moduleId;

    // Fetch course data
    const courseModule = await db.query.modules.findFirst({
        where: eq(modules.id, moduleId),
        with: {
            course: true,
            lessons: true
        }
    });

    if (!courseModule || courseModule.course.id !== courseId) {
        notFound();
    }

    // Get lessons completed
    const { user } = (await auth.api.getSession({
        headers: await headers()
    }))!

    const lessonsCompleted = await db.query.userLessonsComplete.findMany({
        where: eq(userLessonsComplete.userId, user.id),
    })

    const courseLessons = courseModule.lessons.map(lesson => ({
        ...lesson,
        completed: lessonsCompleted.some(l => l.lessonId === lesson.id)
    }))

    const completedLessonsN = lessonsCompleted.filter(l => courseModule.lessons.some(lesson => lesson.id === l.lessonId)).length

    return (
        <div className="grow h-full container mx-auto py-8 px-8 md:px-4">
            <Link href={`/content/${courseId}`} className="flex items-center text-blue-500 hover:underline mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Course
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{courseModule.name}</CardTitle>
                    <CardDescription>{courseModule.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Module Progress</h3>
                        <Progress value={completedLessonsN / courseModule.lessons.length * 100} className="w-full" />
                        <p className="text-sm text-muted-foreground mt-2">
                            {completedLessonsN} of {courseModule.lessons.length} lessons completed
                        </p>
                    </div>
                    <div className="space-y-4">
                        {courseLessons.map((lesson, index) => (
                            <Card key={lesson.id} className={lesson.completed ? "bg-green-100/50 dark:bg-gray-900" : ""}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-md font-medium">
                                        {index + 1}. {lesson.name}
                                    </CardTitle>
                                    {lesson.completed ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <PlayCircle className="h-5 w-5 text-blue-500" />
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-muted-foreground">Duration: {lesson.duration} minutes</p>
                                        <Link href={`/content/${courseId}/${moduleId}/${lesson.id}`}>
                                            <Button
                                                variant={lesson.completed ? "outline" : "default"}
                                                size="sm"
                                            >
                                                {lesson.completed ? "Review" : "Start"}
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
