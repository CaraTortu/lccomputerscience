import { type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/app/_components/ui/tabs"
import { type DBLesson } from "~/server/db";

interface ContentViewProps {
    children: ReactNode;
    lesson: DBLesson;
}

export default function ContentView({ children, lesson }: ContentViewProps) {
    return (
        <Card className="flex-grow flex flex-col p-4">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{lesson.name}</CardTitle>
                <CardDescription>{lesson.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
                <Tabs defaultValue="content" className="w-full h-full flex flex-col">
                    <TabsList className="w-fit">
                        <TabsTrigger value="content">Content</TabsTrigger>
                        {lesson.videoUrl && <TabsTrigger value="video">Video</TabsTrigger>}
                        {lesson.presentationUrl && <TabsTrigger value="presentation">Presentation</TabsTrigger>}
                    </TabsList>
                    <TabsContent value="content">{children}</TabsContent>
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
            </CardContent>
        </Card>
    );
}
