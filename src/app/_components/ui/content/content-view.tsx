import { type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/app/_components/ui/tabs"
import { type DBLesson } from "~/server/db";

interface ContentViewProps {
    children: ReactNode;
    lesson: DBLesson;
    className?: string
}

function ContentTabs({ lesson, children, className }: ContentViewProps) {
    return (
        <Tabs defaultValue="content" className="w-full h-full flex flex-col">
            <TabsList className="w-fit">
                <TabsTrigger value="content">Content</TabsTrigger>
                {lesson.videoUrl && <TabsTrigger value="video">Video</TabsTrigger>}
                {lesson.presentationUrl && <TabsTrigger value="presentation">Presentation</TabsTrigger>}
            </TabsList>
            <TabsContent value="content" className={className}>{children}</TabsContent>
            {lesson.videoUrl && (
                <TabsContent value="video" className="flex-grow flex flex-col">
                    <iframe src={lesson.videoUrl} className="w-full flex-grow" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerPolicy="origin-when-cross-origin" allowFullScreen>
                    </iframe>
                </TabsContent>
            )}
            {lesson.presentationUrl && (
                <TabsContent value="presentation" className="flex flex-col flex-grow">
                    <iframe src={lesson.presentationUrl} className="w-full flex-grow" height="100%" referrerPolicy="origin-when-cross-origin" allowFullScreen />
                </TabsContent>
            )}
        </Tabs>
    )
}

export default function ContentView({ children, lesson }: ContentViewProps) {
    return (
        <>
            <Card className="flex-grow md:flex flex-col p-4 hidden">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{lesson.name}</CardTitle>
                    <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                    <ContentTabs lesson={lesson} className="p-4">{children}</ContentTabs>
                </CardContent>
            </Card>
            <div className="flex md:hidden flex-col gap-12">
                <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-xl">{lesson.name}</h1>
                    <p className="text-primary-foreground/80">{lesson.description}</p>
                </div>
                <ContentTabs lesson={lesson}>{children}</ContentTabs>
            </div>
        </>
    );
}
