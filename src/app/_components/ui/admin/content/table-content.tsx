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
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../../dialog";
import { Separator } from "../../separator";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../../form";
import { Input } from "../../input";
import { Label } from "../../label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../select";
import { Textarea } from "../../textarea";
import { createCourseSchema, updateCourseSchema } from "~/lib/schemas";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type Column = {
    id: string;
    name: string;
    enrolledUsers: number;
    status: string;
    updatedAt: Date;
    image: string;
}

const getColumns: (props: { onRefresh: () => Promise<void> }) => ColumnDef<Column>[] = ({ onRefresh }) => [
    {
        id: "id",
        accessorKey: "id",
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
        header: "Image",
        accessorKey: "image",
        cell: ({ getValue }) => <Image src={getValue<string>()} alt="" className="h-8 w-8" width={32} height={32} />,
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
    },
    {
        accessorKey: "enrolledUsers",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Users Enrolled" />
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

type EditSchema = z.infer<typeof updateCourseSchema>

function EditDialog({ row, onRefresh }: { row: Row<Column>, onRefresh: () => Promise<void> }) {
    const { toast } = useToast()
    const [dialogOpen, setDialogOpen] = useState(false)
    const updateMutation = api.admin.updateCourse.useMutation()

    const form = useForm({
        resolver: zodResolver(updateCourseSchema),
        defaultValues: {
            id: row.getValue<string>("id"),
            name: row.getValue<string>("name"),
            description: row.getValue<string>("description"),
            image: row.getValue<string>("image"),
            status: row.getValue<EditSchema["status"]>("status"),
        }
    })

    const onSubmit = async (data: EditSchema) => {
        const result = await updateMutation.mutateAsync(data)

        if (!result.success) {
            toast({
                title: "Error",
                description: result.reason ?? "An error occurred. Please try again later",
                variant: "destructive",
            })
            return
        }

        setDialogOpen(false)
        toast({
            title: "Course updated successfully",
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
                <DialogTitle>Edit Course - {row.getValue<string>("name")}</DialogTitle>
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
                                            <span className="text-sm text-gray-500">{field.value.length}/200 characters</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="image">Image URL</Label>
                                    <Input {...field} id="image" placeholder="Image URL" />
                                    <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                            <SelectItem value="disabled">Disabled</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                        </SelectContent>
                                    </Select>
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
    const deleteCourseMutation = api.admin.deleteCourse.useMutation();
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const { toast } = useToast()

    const deleteCourse = async () => {
        const deleted = await deleteCourseMutation.mutateAsync({ courseId: row.getValue<string>("id") });
        if (deleted.success) {
            await onRefresh()
            toast({
                title: "Course deleted successfully",
                duration: 2000,
            })
        } else {
            toast({
                title: "Failed to delete course. Try again later.",
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
            <DropdownMenuContent align="end" className="flex flex-col gap-2 p-2">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <EditDialog row={row} onRefresh={onRefresh} />
                <Button size="sm" variant="destructive" onClick={() => deleteCourse()}><Trash2Icon />Delete</Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

type CreateCourseSchema = z.infer<typeof createCourseSchema>

function NewCourseDialog({ onRefresh }: { onRefresh: () => Promise<void> }) {
    const addNewCourseMutation = api.admin.createCourse.useMutation()
    const { toast } = useToast()
    const [dialogOpen, setDialogOpen] = useState(false)

    const form = useForm<CreateCourseSchema>({
        resolver: zodResolver(createCourseSchema),
        defaultValues: {
            name: "",
            description: "",
            image: "",
            status: "draft",
        }
    })

    const onSubmit = async (data: CreateCourseSchema) => {
        const result = await addNewCourseMutation.mutateAsync(data)

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
            title: "Course added successfully",
            duration: 2000,
        })

        await onRefresh()
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
            <DialogTrigger asChild>
                <Button className="flex gap-2"><PlusIcon />Add New Course</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Add New Course</DialogTitle>
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
                                            <span className="text-sm text-gray-500">{field.value.length}/200 characters</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-red-500">{fieldState.error?.message}</p>
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="image">Image URL</Label>
                                    <Input {...field} id="image" placeholder="Image URL" />
                                    <p className="text-red-500 text-sm">{fieldState.error?.message}</p>
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                            <SelectItem value="disabled">Disabled</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                        </SelectContent>
                                    </Select>
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

export function TableContent() {
    const courses = api.admin.getCourses.useQuery();
    const router = useRouter()

    const refreshCourses = useCallback(async () => {
        await courses.refetch()
    }, [courses])

    const columns = useMemo(() => getColumns({
        onRefresh: refreshCourses
    }), [refreshCourses])


    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Courses</h1>
                <NewCourseDialog onRefresh={refreshCourses} />
            </div>
            <DataTable
                columns={columns}
                data={courses.data ?? []}
                isPending={courses.isPending}
                searchBox={true}
                defaultVisibility={{
                    id: false,
                    description: false,
                }}
                onTableRowClick={(row) => router.push(`/admin/content/${row.getValue<string>("id")}`)}
            />
        </>
    )
}
