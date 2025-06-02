"use client"

import { api } from "~/trpc/react";
import { useMemo } from "react";
import { type ColumnDef, type Row } from "@tanstack/react-table"
import { DataTable } from "../../table/data-table";
import { DataTableColumnHeader } from "../../table/table-header";
import { useRouter } from "next/navigation";
import { capitalise } from "~/lib/utils";

type Column = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    tier: string;
    role: string;
    banned: boolean | null;
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
        accessorKey: "role",
        cell: ({ getValue }) => capitalise(getValue<string>()),
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
    },
    {
        accessorKey: "banned",
        cell: ({ getValue }) => getValue<boolean>() ? "Yes" : "No",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Banned" />
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
