import { ArrowLeft, Clock, Users } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Button } from "~/app/_components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { Progress } from "~/app/_components/ui/progress";
import { api } from "~/trpc/server";

/**
 * Course contents
 */
async function CourseContents({ courseId }: { courseId: string }) {
    // Fetch course data
    const course = await api.course.getCourse({ courseId })
    if (!course) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold">{course.name}</CardTitle>
                </div>
                <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{course.courseLength} minutes</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{course.students} {course.students > 1 ? "students" : "student"}</span>
                    </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Course Content</h3>
                <div className="flex flex-col gap-4">
                    {course.modules.map((module, index) => (
                        <Link href={`/content/${course.id}/${module.id}`} key={index}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-md">{module.name}</CardTitle>
                                    <CardDescription>{module.lessons.length} lessons</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

async function CourseContentsFallback() {
    return (
        <Card className="animate-pulse">
            <CardHeader className="gap-4">
                <div className="w-[60%] h-6 bg-gray-300 dark:bg-gray-900 rounded-lg"></div>
                <div className="w-[40%] h-4 bg-gray-300 dark:bg-gray-900 rounded-lg"></div>
            </CardHeader>
            <CardContent>
                <div className="bg-gray-300 dark:bg-gray-900 w-[30%] h-4 mb-6 rounded-lg"></div>
                <div className="mb-2 w-[20%] h-6 rounded-lg bg-gray-300 dark:bg-gray-900"></div>
                <div className="flex flex-col gap-4">
                    {[...Array<number>(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="gap-4">
                                <CardTitle className="bg-gray-300 dark:bg-gray-900 w-[40%] h-4 rounded-lg" />
                                <CardDescription className="bg-gray-300 dark:bg-gray-900 w-[20%] h-3 rounded-lg" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

/**
 * Course progress
 */

async function CourseProgress({ courseId }: { courseId: string }) {
    // Find percentage of course completed
    const courseProgress = await api.course.getCourseProgress({ courseId })
    if (!courseProgress.success) notFound();
    const progress = courseProgress.progress ?? 0

    /**
     * Redirects the user to the latest lesson in the course.
     */
    async function redirectToLatestLesson({ courseId }: { courseId: string }, _formData: FormData) {
        "use server"

        // Enroll user in course 
        await api.course.enrollUser({ courseId })

        const { success, link } = await api.course.getNextLesson({ courseId })

        if (success && link) {
            redirect(link)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <Progress value={progress} className="w-full" />
                <p className="text-center mt-2">{progress}% complete</p>
                <form action={redirectToLatestLesson.bind(null, { courseId })}>
                    <Button className="w-full mt-4">{progress > 0 ? "Continue Course" : "Start Course"}</Button>
                </form>
            </CardContent>
        </Card>
    )
}

async function CourseProgressFallback() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-4 bg-gray-300 dark:bg-gray-900 rounded-lg"></div>
                <div className="flex justify-center">
                    <p className="text-center mt-4 w-[50%] h-4 bg-gray-300 dark:bg-gray-900 rounded-lg"></p>
                </div>
                <div className="w-full mt-4 bg-gray-300 dark:bg-gray-900 h-10 rounded-lg"></div>
            </CardContent>
        </Card>
    )
}

/**
 * Displays a course.
 */
export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const courseId = (await params).courseId;

    return (
        <div className="flex-grow h-full container mx-auto py-8">
            <Link href="/content" className="flex items-center text-blue-500 hover:underline mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Content
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Suspense fallback={<CourseContentsFallback />}>
                        <CourseContents courseId={courseId} />
                    </Suspense>
                </div>
                <div>
                    <Suspense fallback={<CourseProgressFallback />}>
                        <CourseProgress courseId={courseId} />
                    </Suspense>
                </div>
            </div>
        </div >
    )
}
