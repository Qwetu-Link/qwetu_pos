"use client";

import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/utils";

export type SimpleTableRow = {
  id: string;
  cells: React.ReactNode[];
};

type TableColumnMeta = {
  className?: string;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  toolbar?: React.ReactNode;
  pageSize?: number;
  minWidth?: string;
  emptyMessage?: string;
  containerClassName?: string;
  headerRowClassName?: string;
  rowClassName?: string;
  showToolbar?: boolean;
  showColumnToggle?: boolean;
  showPagination?: boolean;
  dark?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
  toolbar,
  pageSize = 10,
  minWidth,
  emptyMessage = "No results found.",
  containerClassName,
  headerRowClassName,
  rowClassName,
  showToolbar = false,
  showColumnToggle = false,
  showPagination = data.length > pageSize,
  dark = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // TanStack Table intentionally returns function-heavy instances that React Compiler cannot memoize safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
      rowSelection,
    },
    initialState: {
      pagination: { pageSize },
    },
  });

  const filteredCount = table.getFilteredRowModel().rows.length;
  const firstRow = filteredCount === 0 ? 0 : table.getState().pagination.pageIndex * pageSize + 1;
  const lastRow = Math.min((table.getState().pagination.pageIndex + 1) * pageSize, filteredCount);
  const pageCount = Math.max(table.getPageCount(), 1);
  const hideableColumns = table.getAllColumns().filter((column) => column.getCanHide());

  return (
    <div className={cn("space-y-4", containerClassName)}>
      {showToolbar || showColumnToggle || toolbar ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {showToolbar ? (
            <div className="relative max-w-sm flex-1">
              <Search className={cn("absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", dark ? "text-[#7F9AB5]" : "text-slate-400")} />
              <input
                placeholder={searchPlaceholder}
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className={cn(
                  "h-9 w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:ring-2",
                  dark
                    ? "border-[#42688C]/30 bg-[#13203A] text-white placeholder:text-[#7F9AB5] focus:ring-[#42688C]/50"
                    : "border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus:ring-emerald-500/30",
                )}
              />
            </div>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            {toolbar}
            {showColumnToggle && hideableColumns.length ? (
              <details className="relative">
                <summary
                  className={cn(
                    "flex h-9 cursor-pointer list-none items-center gap-2 rounded-lg border px-3 text-sm font-medium [&::-webkit-details-marker]:hidden",
                    dark
                      ? "border-[#42688C]/30 bg-[#13203A] text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  )}
                >
                  Columns
                  <ChevronDown className="h-4 w-4" />
                </summary>
                <div
                  className={cn(
                    "absolute right-0 z-20 mt-2 w-44 rounded-lg border p-1 shadow-lg",
                    dark ? "border-[#42688C]/30 bg-[#13203A]" : "border-slate-200 bg-white",
                  )}
                >
                  {hideableColumns.map((column) => (
                    <label
                      key={column.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm capitalize",
                        dark ? "text-[#D6E4F0] hover:bg-[#1D2C4A]" : "text-slate-700 hover:bg-slate-50",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={(event) => column.toggleVisibility(event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      {column.id.replace(/([A-Z])/g, " $1")}
                    </label>
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className={cn("overflow-hidden rounded-xl border", dark ? "border-[#42688C]/30" : "border-slate-200 bg-white shadow-sm")}>
        <Table className={minWidth}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={cn(
                  dark ? "border-[#42688C]/30 bg-[#13203A] hover:bg-[#13203A]" : "bg-slate-50",
                  headerRowClassName,
                )}
              >
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as TableColumnMeta | undefined;

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(dark ? "text-[#9CB4CA]" : undefined, meta?.className)}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className={cn(
                            "flex items-center gap-1 text-left",
                            header.column.getCanSort() ? "cursor-pointer select-none" : "cursor-default",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() ? (
                            <ArrowUpDown className={cn("h-3 w-3", dark ? "text-[#7F9AB5]" : "text-slate-400")} />
                          ) : null}
                        </button>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={cn(dark ? "border-[#42688C]/20 hover:bg-[#13203A]" : undefined, rowClassName)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as TableColumnMeta | undefined;

                    return (
                      <TableCell key={cell.id} className={meta?.className}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className={cn("h-32 text-center", dark ? "text-[#9CB4CA]" : "text-slate-500")}>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination ? (
        <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", dark ? "text-[#9CB4CA]" : "text-slate-500")}>
          <div className="text-sm">
            {table.getFilteredSelectedRowModel().rows.length > 0 ? (
              <span className="mr-4">
                {table.getFilteredSelectedRowModel().rows.length} of {filteredCount} row(s) selected.
              </span>
            ) : null}
            Showing {firstRow}-{lastRow} of {filteredCount}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className={cn("text-sm font-medium", dark ? "text-white" : "text-slate-700")}>
              Page {Math.min(table.getState().pagination.pageIndex + 1, pageCount)} of {pageCount}
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.setPageIndex(pageCount - 1)} disabled={!table.getCanNextPage()}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SimpleDataTable({
  headers,
  rows,
  minWidth,
  emptyMessage,
  dark,
  showPagination,
}: {
  headers: Array<string | { label: string; className?: string }>;
  rows: SimpleTableRow[];
  minWidth?: string;
  emptyMessage?: string;
  dark?: boolean;
  showPagination?: boolean;
}) {
  const columns = React.useMemo<ColumnDef<SimpleTableRow>[]>(
    () =>
      headers.map((header, index) => {
        const label = typeof header === "string" ? header : header.label;
        const className = typeof header === "string" ? undefined : header.className;

        return {
          id: `${label}-${index}`,
          header: label,
          enableSorting: false,
          meta: { className },
          cell: ({ row }) => row.original.cells[index],
        };
      }),
    [headers],
  );

  return (
    <DataTable
      columns={columns}
      data={rows}
      minWidth={minWidth}
      emptyMessage={emptyMessage}
      dark={dark}
      showPagination={showPagination ?? false}
    />
  );
}
