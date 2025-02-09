import { and, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { lessons, userLessonsComplete } from "~/server/db/schema";
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMath from 'remark-math'
import rehypeFormat from 'rehype-format'
import rehypeSanitize from 'rehype-sanitize'
import remarkRehype from "remark-rehype"
import rehypeShiki from "rehype-pretty-code"
import rehypeRaw from 'rehype-raw'
import rehypeMathjax from 'rehype-mathjax'
import rehypeStringify from "rehype-stringify"
import { transformerCopyButton } from "@rehype-pretty/transformers"
import ContentView from "~/app/_components/ui/content/content-view";
import { auth } from "~/server/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/app/_components/ui/card";

async function ModulePageContent({ params }: { params: Promise<{ courseId: string, moduleId: string, lessonId: string }> }) {
    const courseId = (await params).courseId;
    const moduleId = (await params).moduleId;
    const lessonId = (await params).lessonId;

    // Fetch course data
    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            module: true
        }
    });

    if (!lesson || lesson.moduleId !== moduleId || lesson.module.courseId !== courseId) {
        notFound();
    }

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) {
        const lessonCompleted = await db.query.userLessonsComplete.findFirst({
            where: and(eq(userLessonsComplete.lessonId, lessonId), eq(userLessonsComplete.userId, session.user.id))
        })

        if (!lessonCompleted) {
            await db.insert(userLessonsComplete).values({
                lessonId: lessonId,
                userId: session.user.id
            }).execute()
        }
    }

    const content = lesson.content ? await unified()
        .use(remarkParse)
        .use(remarkDirective)
        .use(remarkFrontmatter)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeFormat)
        .use(rehypeSanitize)
        .use(rehypeMathjax)
        .use(rehypeShiki, {
            theme: "catppuccin-macchiato",
            transformers: [transformerCopyButton({
                visibility: "always",
                feedbackDuration: 2000,
            })]
        })
        .use(rehypeStringify)
        .process(lesson.content)
        .then((file) => file.toString())
        : "";

    return (
        <ContentView lesson={lesson}>
            <div className="mdPost font-sans overflow-auto" dangerouslySetInnerHTML={{ __html: content }}>
            </div>
        </ContentView>
    )
}

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
