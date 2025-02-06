"use client"

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type Row,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../table"
import { useState } from "react"
import { Input } from "../input"
import { DataTablePagination } from "./table-pagination"
import { DataTableViewOptions } from "./table-col-toggle"

function TableContentFallback({ columnsN }: { columnsN: number }) {
    return (
        <TableBody>
            {[...Array<number>(5)].map((_, index) => (
                <TableRow key={index} className="animate-pulse">
                    {[...Array<number>(columnsN)].map((_, i) => (
                        <TableCell key={i}>
                            <div className="h-8 w-full max-w-sm rounded-lg bg-gray-300 dark:bg-gray-900" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    )
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    defaultVisibility?: VisibilityState
    defaultPagination?: PaginationState
    searchBox?: boolean
    isPending?: boolean
    onTableRowClick?: (row: Row<TData>) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    defaultVisibility,
    defaultPagination,
    searchBox,
    isPending,
    onTableRowClick
}: DataTableProps<TData, TValue>) {

    const [globalFilter, setGlobalFilter] = useState<string>("")
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(defaultVisibility ?? {
        id: false
    })
    const [pagination, setPagination] = useState<PaginationState>(defaultPagination ?? {
        pageSize: 5,
        pageIndex: 0
    })

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        globalFilterFn: "includesString",
        onGlobalFilterChange: setGlobalFilter,
        state: {
            columnVisibility,
            sorting,
            pagination,
            globalFilter
        }
    })

    return (
        <>
            <div className="flex w-full">
                {searchBox && (
                    <div className="mb-4">
                        <Input
                            placeholder={`Search...`}
                            value={globalFilter}
                            onChange={(event) =>
                                table.setGlobalFilter(String(event.target.value))
                            }
                            className="max-w-sm"
                        />
                    </div>
                )}
                <div className="grow flex justify-end">
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            <div className="rounded-md border w-full z-0">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    {isPending ? <TableContentFallback columnsN={table.getHeaderGroups().reduce((acc, hg) => acc += hg.headers.length, 0)} /> : (
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        onClick={() => onTableRowClick && onTableRowClick(row)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    )}
                </Table>
            </div>
            <div className="mt-4">
                <DataTablePagination table={table} />
            </div>
        </>
    )
}

