"use client"

import { type DBLesson } from "~/server/db"
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../../breadcrumb";
import { type z } from "zod";
import { updateLessonSchema } from "~/lib/schemas";
import { useToast } from "~/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../../form";
import { Label } from "../../label";
import { Input } from "../../input";
import { Button } from "../../button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

type EditContentSchema = z.infer<typeof updateLessonSchema>

export function ContentEditor({ lesson, courseId, courseName, moduleId, moduleName }: { lesson: DBLesson, courseId: string, moduleId: string, courseName: string, moduleName: string }) {
    const theme = useTheme()
    const { toast } = useToast()
    const router = useRouter()
    const updateLessonMutation = api.admin.updateLesson.useMutation()

    const form = useForm<EditContentSchema>({
        resolver: zodResolver(updateLessonSchema),
        defaultValues: {
            ...lesson
        }
    })

    form.watch(() => {
        console.log(form.formState.errors)
    })

    const onSubmit = async (data: EditContentSchema) => {
        const result = await updateLessonMutation.mutateAsync(data)

        if (result.success) {
            toast({
                title: "Lesson updated",
                description: "The lesson has been updated successfully",
            })
        } else {
            toast({
                title: "Error updating lesson",
                description: "An error occurred while updating the lesson",
                variant: "destructive"
            })
        }

        router.refresh()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
                <div className="h-full w-full flex gap-4">
                    <div className="flex flex-col flex-grow h-full gap-8">
                        <Breadcrumb>
                            <BreadcrumbList className="text-lg">
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/admin/content/`}>Courses</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/admin/content/${courseId}`}>{courseName}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/admin/content/${courseId}/${moduleId}`}>{moduleName}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/admin/content/${courseId}/${moduleId}/${lesson.id}`}>{lesson.name}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem className="text-black dark:text-primary-foreground">
                                    Content Editor
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <MDEditor
                                    data-color-mode={theme.resolvedTheme === "dark" ? "dark" : "light"}
                                    className="flex-grow"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-4 p-4 pt-16 max-w-sm w-full">
                        <h1 className="font-bold text-2xl">Other fields</h1>
                        <FormField
                            control={form.control}
                            name="videoUrl"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="videoUrl">Video URL</Label>
                                    <Input {...field} value={field.value ?? ""} id="videoUrl" placeholder="https://example.com" />
                                    <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="presentationUrl"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="presentationURL">Presentation URL</Label>
                                    <Input {...field} value={field.value ?? ""} id="presentationURL" placeholder="https://example.com" />
                                    <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                                </div>
                            )}
                        />

                        <Button><Save />Save</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
