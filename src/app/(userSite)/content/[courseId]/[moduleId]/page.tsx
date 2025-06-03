import { eq } from "drizzle-orm";
import { ArrowLeft, CheckCircle, PlayCircle } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "~/app/_components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { Progress } from "~/app/_components/ui/progress";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { modules, userLessonsComplete } from "~/server/db/schema";

async function ModulePageContents({ params }: { params: Promise<{ courseId: string, moduleId: string }> }) {
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
                        <Card key={lesson.id} className={lesson.completed ? "bg-green-900/10" : ""}>
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
    )
}

async function ModulePageFallback() {
    return (
        <Card>
            <CardHeader className="animate-pulse">
                <CardTitle className="text-2xl font-bold w-32 h-4 rounded-lg bg-gray-300 dark:bg-gray-900"></CardTitle>
                <CardDescription className="w-full max-w-sm h-4 rounded-lg bg-gray-300 dark:bg-gray-900 "></CardDescription>
            </CardHeader>
            <CardContent className="animate-pulse">
                <div className="mb-6 w-full">
                    <h3 className="text-lg font-semibold mb-2 w-32 h-6 rounded-lg bg-gray-300 dark:bg-gray-900"></h3>
                    <div className="w-full h-4 rounded-lg bg-gray-300 dark:bg-gray-900" />
                    <div className="text-sm text-muted-foreground mt-2 w-32 h-4 rounded-lg bg-gray-300 dark:bg-gray-900">
                    </div>
                </div>
                <div className="space-y-4">
                    {[...Array<number>(3)].map((_, index) => (
                        <Card key={index} className="rounded-lg bg-gray-300 dark:bg-gray-900">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold w-32 h-4 rounded-lg bg-gray-300 dark:bg-gray-900"></CardTitle>
                                <div className="size-5 rounded-full bg-gray-300 dark:bg-gray-900"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-muted-foreground w-16 h-4 rounded-lg bg-gray-300 dark:bg-gray-900"></p>
                                    <div className="h-8 w-32  rounded-lg bg-gray-300 dark:bg-gray-900"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default async function ModulePage({ params }: { params: Promise<{ courseId: string, moduleId: string }> }) {
    const courseId = (await params).courseId;

    return (
        <div className="grow h-full container mx-auto pb-8 pt-4 md:pb-4 px-8 md:px-4">
            <Link href={`/content/${courseId}`} className="flex items-center mb-8 md:mb-4">
                <Button variant={"link"} className="text-lg md:text-sm text-purple-200/80">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Course
                </Button>
            </Link>
            <Suspense fallback={<ModulePageFallback />}>
                <ModulePageContents params={params} />
            </Suspense>
        </div>
    )
}
