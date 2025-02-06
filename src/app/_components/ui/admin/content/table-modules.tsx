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
import { createModuleSchema, updateModuleSchema } from "~/lib/schemas";
import { PlusIcon } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../../breadcrumb";
import { useRouter } from "next/navigation";

type Column = {
    id: string;
    courseId: string;
    name: string;
    description: string | null;
    updatedAt: Date;
}

const getColumns: (props: { onRefresh: () => Promise<void> }) => ColumnDef<Column>[] = ({ onRefresh }) => [
    {
        id: "id",
        accessorKey: "id",
    },
    {
        id: "courseId",
        accessorKey: "courseId",
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

type EditSchema = z.infer<typeof updateModuleSchema>

function EditDialog({ row, onRefresh }: { row: Row<Column>, onRefresh: () => Promise<void> }) {
    const { toast } = useToast()
    const [dialogOpen, setDialogOpen] = useState(false)
    const updateMutation = api.admin.updateModule.useMutation()

    const form = useForm({
        resolver: zodResolver(updateModuleSchema),
        defaultValues: {
            id: row.getValue<string>("id"),
            courseId: row.getValue<string>("courseId"),
            name: row.getValue<string>("name"),
            description: row.getValue<string>("description"),
        }
    })

    const onSubmit = async (data: EditSchema) => {
        const result = await updateMutation.mutateAsync(data)

        if (!result.success) {
            toast({
                title: "Error",
                description: "Module not found",
                variant: "destructive",
            })
            return
        }

        setDialogOpen(false)
        toast({
            title: "Module updated successfully",
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
                <DialogTitle>Edit Module - {row.getValue<string>("name")}</DialogTitle>
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

                        <Button type="submit">Save</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )

}

function ActionsCell({ row, onRefresh }: { row: Row<Column>, onRefresh: () => Promise<void> }) {
    const deleteModuleMutation = api.admin.deleteModule.useMutation();
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const { toast } = useToast()

    const deleteModule = async () => {
        const deleted = await deleteModuleMutation.mutateAsync({ moduleId: row.getValue<string>("id") });
        if (deleted.success) {
            await onRefresh()
            toast({
                title: "Module deleted successfully",
                duration: 2000,
            })
        } else {
            toast({
                title: "Failed to delete module. Try again later.",
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
                <Button size="sm" variant="destructive" onClick={() => deleteModule()}><Trash2Icon />Delete</Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

type CreateModuleSchema = z.infer<typeof createModuleSchema>

function NewModuleDialog({ onRefresh, courseId }: { onRefresh: () => Promise<void>, courseId: string }) {
    const addNewModuleMutation = api.admin.createModule.useMutation()
    const { toast } = useToast()
    const [dialogOpen, setDialogOpen] = useState(false)

    const form = useForm<CreateModuleSchema>({
        resolver: zodResolver(createModuleSchema),
        defaultValues: {
            name: "",
            description: "",
            courseId,
        }
    })

    const onSubmit = async (data: CreateModuleSchema) => {
        const result = await addNewModuleMutation.mutateAsync(data)

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
            title: "Module added successfully",
            duration: 2000,
        })

        await onRefresh()
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
            <DialogTrigger asChild>
                <Button className="flex gap-2"><PlusIcon />Add New Module</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Add New Module</DialogTitle>
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

                        <Button type="submit">Save</Button>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}

export function TableModules({ courseId, courseName }: { courseId: string, courseName: string }) {
    const modules = api.admin.getModules.useQuery({ courseId });
    const router = useRouter()

    const refreshModules = useCallback(async () => {
        await modules.refetch()
    }, [modules])

    const columns = useMemo(() => getColumns({
        onRefresh: refreshModules
    }), [refreshModules])


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
                        <BreadcrumbItem className="text-black dark:text-primary-foreground">
                            Modules
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <NewModuleDialog onRefresh={refreshModules} courseId={courseId} />
            </div>
            <DataTable
                columns={columns}
                data={modules.data?.data ?? []}
                isPending={modules.isPending}
                searchBox={true}
                defaultVisibility={{
                    id: false,
                    courseId: false,
                }}
                onTableRowClick={(row) => {
                    router.push(`/admin/content/${courseId}/${row.getValue<string>("id")}`)
                }}
            />
        </>
    )
}
