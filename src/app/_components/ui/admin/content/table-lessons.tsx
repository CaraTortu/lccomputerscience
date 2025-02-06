"use client"
import { api } from "~/trpc/react";
import { useCallback, useMemo, useState } from "react";
import { type ColumnDef, type Row } from "@tanstack/react-table"
import { MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react"
import { Button } from "~/app/_components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu"
import { useToast } from "~/hooks/use-toast";
import { DataTable } from "../../table/data-table";
import { DataTableColumnHeader } from "../../table/table-header";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../../dialog";
import { Separator } from "../../separator";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../../form";
import { Input } from "../../input";
import { Label } from "../../label";
import { Textarea } from "../../textarea";
import { createLessonSchema, updateLessonSchema } from "~/lib/schemas";
import { PlusIcon } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../../breadcrumb";
import { useRouter } from "next/navigation";

type Column = {
    id: string;
    moduleId: string;
    name: string;
    description: string | null;
    content: string | null;
    duration: number;
    videoUrl: string | null;
    presentationUrl: string | null;
    updatedAt: Date;
}

const getColumns: (props: { onRefresh: () => Promise<void> }) => ColumnDef<Column>[] = ({ onRefresh }) => [
    {
        id: "id",
        accessorKey: "id",
    },
    {
        id: "moduleId",
        accessorKey: "moduleId",
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
    },
    {
        accessorKey: "content",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Content" />
        ),
    },
    {
        accessorKey: "duration",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Duration" />
        ),
    },
    {
        accessorKey: "videoUrl",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Video URL" />
        ),
    },
    {
        accessorKey: "presentationUrl",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Presentation URL" />
        ),
    },
    {
        accessorKey: "updatedAt",
        cell: ({ row }) => row.getValue<Date>("updatedAt").toLocaleString(),
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Updated" />
        ),
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => <ActionsCell row={row} onRefresh={onRefresh} />
    }
];

type EditSchema = z.infer<typeof updateLessonSchema>

function EditDialog({ row, onRefresh }: { row: Row<Column>, onRefresh: () => Promise<void> }) {
    const { toast } = useToast()
    const [dialogOpen, setDialogOpen] = useState(false)
    const updateMutation = api.admin.updateLesson.useMutation()

    const form = useForm({
        resolver: zodResolver(updateLessonSchema),
        defaultValues: {
            id: row.getValue<string>("id"),
            moduleId: row.getValue<string>("moduleId"),
            name: row.getValue<string>("name"),
            description: row.getValue<string | undefined>("description"),
            duration: row.getValue<number>("duration"),
            content: row.getValue<string | undefined>("content"),
            videoUrl: row.getValue<string | undefined>("videoUrl"),
            presentationUrl: row.getValue<string | undefined>("presentationUrl"),
        }
    })

    const onSubmit = async (data: EditSchema) => {
        const result = await updateMutation.mutateAsync(data)

        if (!result.success) {
            toast({
                title: "Error",
                description: "Lesson not found",
                variant: "destructive",
            })
            return
        }

        setDialogOpen(false)
        toast({
            title: "Lesson updated successfully",
            duration: 2000,
        })

        await onRefresh()
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
            <DialogTrigger asChild>
                <Button size="sm"><PencilIcon />Edit</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Edit Lesson - {row.getValue<string>("name")}</DialogTitle>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input {...field} id="name" placeholder="Name" />
                                    <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="message">Description</Label>
                                    <div className="relative">
                                        <Textarea
                                            {...field}
                                            placeholder="Your description here"
                                            className="min-h-32"
                                            maxLength={500}
                                        />
                                        <div className="absolute bottom-2 right-4">
                                            <span className="text-sm text-gray-500">{field.value?.length}/200 characters</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="duration">Duration in minutes</Label>
                                    <Input value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} id="duration" type="number" placeholder="Duration" />
                                    <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
                                </div>
                            )}
                        />

                        <Button type="submit">Save</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )

}

function ActionsCell({ row, onRefresh }: { row: Row<Column>, onRefresh: () => Promise<void> }) {
    const deleteLessonMutation = api.admin.deleteLesson.useMutation();
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const { toast } = useToast()

    const deleteLesson = async () => {
        const deleted = await deleteLessonMutation.mutateAsync({ lessonId: row.getValue<string>("id") });
        if (deleted.success) {
            await onRefresh()
            toast({
                title: "Lesson deleted successfully",
                duration: 2000,
            })
        } else {
            toast({
                title: "Failed to delete lesson. Try again later.",
                variant: "destructive",
                duration: 2000,
            })
        }

        setDropdownOpen(false)
    }

    return (
        <DropdownMenu open={dropdownOpen} onOpenChange={(open) => setDropdownOpen(open)}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-2 p-2" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <EditDialog row={row} onRefresh={onRefresh} />
                <Button size="sm" variant="destructive" onClick={() => deleteLesson()}><Trash2Icon />Delete</Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

type CreateLessonSchema = z.infer<typeof createLessonSchema>

function NewLessonDialog({ onRefresh, moduleId }: { onRefresh: () => Promise<void>, moduleId: string }) {
    const addNewLessonMutation = api.admin.createLesson.useMutation()
    const { toast } = useToast()
    const [dialogOpen, setDialogOpen] = useState(false)

    const form = useForm<CreateLessonSchema>({
        resolver: zodResolver(createLessonSchema),
        defaultValues: {
            name: "",
            description: "",
            duration: 10,
            content: "",
            videoUrl: "",
            presentationUrl: "",
            moduleId,
        }
    })

    const onSubmit = async (data: CreateLessonSchema) => {
        const result = await addNewLessonMutation.mutateAsync(data)

        if (!result.success) {
            toast({
                title: "Error",
                description: "An error occurred. Please try again later",
                variant: "destructive",
            })
            return
        }

        setDialogOpen(false)
        toast({
            title: "Lesson added successfully",
            duration: 2000,
        })

        await onRefresh()
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
            <DialogTrigger asChild>
                <Button className="flex gap-2"><PlusIcon />Add New Lesson</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Add New Lesson</DialogTitle>
                <Separator />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input {...field} id="name" placeholder="Name" />
                                    <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="message">Description</Label>
                                    <div className="relative">
                                        <Textarea
                                            {...field}
                                            value={field.value ?? ""}
                                            placeholder="Your description here"
                                            className="min-h-32"
                                            maxLength={500}
                                        />
                                        <div className="absolute bottom-2 right-4">
                                            <span className="text-sm text-gray-500">{field.value?.length}/200 characters</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="duration">Duration in minutes</Label>
                                    <Input value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} id="duration" type="number" placeholder="Duration" />
                                    <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
                                </div>
                            )}
                        />

                        <Button type="submit">Save</Button>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}

export function TableLessons({ moduleId, courseId, courseName, moduleName }: { moduleId: string, courseId: string, courseName: string, moduleName: string }) {
    const lessons = api.admin.getLessons.useQuery({ moduleId });
    const router = useRouter()

    const refreshLessons = useCallback(async () => {
        await lessons.refetch()
    }, [lessons])

    const columns = useMemo(() => getColumns({
        onRefresh: refreshLessons
    }), [refreshLessons])


    return (
        <>
            <div className="flex justify-between items-center mb-6">
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
                        <BreadcrumbItem className="text-black dark:text-primary-foreground">
                            Lessons
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <NewLessonDialog onRefresh={refreshLessons} moduleId={moduleId} />
            </div>
            <DataTable
                columns={columns}
                data={lessons.data?.data ?? []}
                isPending={lessons.isPending}
                searchBox={true}
                defaultVisibility={{
                    id: false,
                    moduleId: false,
                    content: false,
                    videoUrl: false,
                    presentationUrl: false,
                }}
                onTableRowClick={(row) => router.push(`/admin/content/${courseId}/${moduleId}/${row.getValue<string>("id")}`)}
            />
        </>
    )
}
