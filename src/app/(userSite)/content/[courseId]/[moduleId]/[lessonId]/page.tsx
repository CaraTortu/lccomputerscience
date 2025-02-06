import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { db } from "~/server/db";
import { lessons } from "~/server/db/schema";
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeShiki from "rehype-pretty-code"
import rehypeStringify from "rehype-stringify"
import { transformerCopyButton } from "@rehype-pretty/transformers"

export default async function ModulePage({ params }: { params: Promise<{ courseId: string, moduleId: string, lessonId: string }> }) {
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

    const content = lesson.content ? await unified()
        .use(remarkParse)
        .use(remarkRehype)
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
        <div className="grow h-full container mx-auto py-8">
            <Link href={`/content/${courseId}/${moduleId}`} className="flex items-center text-blue-500 hover:underline mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Module
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{lesson.name}</CardTitle>
                    <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mdPost font-sans" dangerouslySetInnerHTML={{ __html: content }}>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
