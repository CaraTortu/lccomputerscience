import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { ModulePageContent } from "~/app/_components/ui/content/lesson-content";

async function ModuleContentFallback() {
    return (
        <Card className="flex-grow flex flex-col p-4">
            <CardHeader className=" animate-pulse">
                <CardTitle className="text-2xl font-bold w-32 h-4 rounded-lg bg-gray-300 dark:bg-gray-900"></CardTitle>
                <CardDescription className="w-full max-w-sm h-4 rounded-lg bg-gray-300 dark:bg-gray-900 "></CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow animate-pulse gap-6">
                <div className="w-64 h-8 rounded-lg bg-gray-300 dark:bg-gray-900"></div>
                <div className="w-32 h-4 rounded-lg bg-gray-300 dark:bg-gray-900"></div>
                <div className="w-16 h-6 rounded-lg bg-gray-300 dark:bg-gray-900"></div>
                <div className="w-24 h-5 rounded-lg bg-gray-300 dark:bg-gray-900"></div>
            </CardContent>
        </Card>
    )
}

export default async function ModulePage({ params }: { params: Promise<{ courseId: string, moduleId: string, lessonId: string }> }) {
    const courseId = (await params).courseId;
    const moduleId = (await params).moduleId;


    return (
        <div className="grow h-full container mx-auto py-8 px-8 md:px-4 flex flex-col">
            <Link href={`/content/${courseId}/${moduleId}`} className="flex items-center text-blue-500 hover:underline mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Module
            </Link>
            <Suspense fallback={<ModuleContentFallback />}>
                <ModulePageContent params={params} />
            </Suspense>
        </div>
    )
}
