"use client"

import { api } from "~/trpc/react";
import { useMemo } from "react";
import { type ColumnDef, type Row } from "@tanstack/react-table"
import { DataTable } from "../../table/data-table";
import { DataTableColumnHeader } from "../../table/table-header";
import { useRouter } from "next/navigation";

type Column = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    tier: string;
    role: string;
    createdAt: Date;
}

const getColumns: () => ColumnDef<Column>[] = () => [
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
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "emailVerified",
        cell: ({ getValue }) => getValue<boolean>() ? "Yes" : "No",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email Verified" />
        ),
    },
    {
        accessorKey: "tier",
        cell: ({ getValue }) => getValue<string>().charAt(0).toUpperCase() + getValue<string>().slice(1),
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tier" />
        ),
    },
    {
        accessorKey: "role",
        cell: ({ getValue }) => getValue<string>().charAt(0).toUpperCase() + getValue<string>().slice(1),
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
    },
    {
        accessorKey: "createdAt",
        cell: ({ getValue }) => getValue<Date>().toUTCString(),
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
    },
];

export function TableUsers() {
    const courses = api.admin.getUsers.useQuery();
    const columns = useMemo(() => getColumns(), [])

    const router = useRouter()

    return (
        <DataTable
            columns={columns}
            data={courses.data ?? []}
            isPending={courses.isPending}
            searchBox={true}
            onTableRowClick={(row: Row<Column>) => {
                router.push(`/admin/users/${row.getValue<string>("id")}`)
            }}
        />
    )
}
