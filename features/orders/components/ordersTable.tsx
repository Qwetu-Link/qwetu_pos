"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  type ColumnDef,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  Download,
  Eye,
  Inbox,
  MoreHorizontal,
  Rows3,
  Rows4,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/uii/table";
import { cn } from "@/utils/utils";
import StatusBadge from "./statusBadge";
import type { Density, Order } from "@/types/admin/orderTypes";
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  getOrderDisplayNumber,
} from "@/utils/orderUtils";

type BulkAction = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "neutral" | "danger";
  onSelect: (selectedIds: string[]) => void;
};

type TableColumnMeta = {
  className?: string;
};

interface OrdersTableProps {
  orders: Order[];
  density: Density;
  onDensityChange: (density: Density) => void;
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: (visibility: VisibilityState) => void;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  cancellingOrderId?: string | null;
  deletingOrderId?: string | null;
  onCancel?: (order: Order) => void;
  onDelete?: (ids: string[]) => void;
  onRowDelete?: (id: string) => void;
  onRowClick: (order: Order) => void;
  isLoading?: boolean;
  totalRows: number;
  emptyState?: React.ReactNode;
}

function getColumns(): ColumnDef<Order>[] {
  return [
    {
      id: "select",
      size: 44,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">
            {row.original.customer}
          </span>
          <span className="text-xs text-slate-400">
            {getOrderDisplayNumber(row.original)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm text-slate-700">{row.original.email}</span>
          <span className="text-xs text-slate-400">{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: "items",
      header: "Items",
      meta: { className: "text-right" },
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-slate-700">
          {row.original.items}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      meta: { className: "text-right" },
      cell: ({ row }) => (
        <span
          className="font-semibold tabular-nums text-emerald-700"
          title={formatCurrency(row.original.total)}
        >
          {formatCompactCurrency(row.original.total)}
        </span>
      ),
    },
    {
      accessorKey: "paymentType",
      header: "Payment",
      cell: ({ row }) => <PaymentCell order={row.original} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      meta: { className: "text-right" },
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "action",
      header: "",
      enableSorting: false,
      enableHiding: false,
      meta: { className: "text-right" },
    },
  ];
}

export default function OrdersTable({
  orders,
  density,
  onDensityChange,
  columnVisibility,
  onColumnVisibilityChange,
  sorting,
  onSortingChange,
  cancellingOrderId,
  deletingOrderId,
  onCancel,
  onDelete,
  onRowDelete,
  onRowClick,
  isLoading = false,
  totalRows,
  emptyState,
}: OrdersTableProps) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const lastSelectedIndex = React.useRef<number | null>(null);
  const tableRef = React.useRef<HTMLDivElement>(null);

  const columns = React.useMemo(() => getColumns(), []);

  // TanStack Table intentionally returns function-heavy instances that React Compiler cannot memoize safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: orders,
    columns,
    state: {
      rowSelection,
      columnVisibility,
      sorting,
      pagination,
    },
    getRowId: (order) => order.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: (updater) => {
      onColumnVisibilityChange(
        typeof updater === "function" ? updater(columnVisibility) : updater,
      );
    },
    onSortingChange: (updater) => {
      onSortingChange(typeof updater === "function" ? updater(sorting) : updater);
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  const selectedIds = React.useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection],
  );
  const selectedCount = selectedIds.length;
  const pageRowIds = React.useMemo(() => rows.map((row) => row.id), [rows]);
  const pageSelectedCount = pageRowIds.filter((id) => rowSelection[id]).length;
  const isAllPageSelected =
    pageRowIds.length > 0 && pageSelectedCount === pageRowIds.length;
  const isSomePageSelected = pageSelectedCount > 0 && !isAllPageSelected;
  const allFilteredRowIds = React.useMemo(
    () => table.getSortedRowModel().rows.map((row) => row.id),
    [table],
  );

  const togglePageSelection = React.useCallback(
    (checked: boolean) => {
      setRowSelection((prev) => {
        const next = { ...prev };
        for (const id of pageRowIds) {
          if (checked) next[id] = true;
          else delete next[id];
        }
        return next;
      });
    },
    [pageRowIds],
  );

  const selectAllFiltered = React.useCallback(() => {
    setRowSelection((prev) => {
      const next = { ...prev };
      for (const id of allFilteredRowIds) next[id] = true;
      return next;
    });
  }, [allFilteredRowIds]);

  const toggleRow = React.useCallback(
    (row: Row<Order>, checked: boolean, shiftKey: boolean) => {
      setRowSelection((prev) => {
        const next = { ...prev };
        if (shiftKey && lastSelectedIndex.current !== null) {
          const currentIndex = rows.findIndex((item) => item.id === row.id);
          if (currentIndex !== -1) {
            const start = Math.min(lastSelectedIndex.current, currentIndex);
            const end = Math.max(lastSelectedIndex.current, currentIndex);
            for (let index = start; index <= end; index++) {
              next[rows[index].id] = true;
            }
          }
        } else if (checked) {
          next[row.id] = true;
        } else {
          delete next[row.id];
        }
        return next;
      });
      lastSelectedIndex.current = rows.findIndex((item) => item.id === row.id);
    },
    [rows],
  );

  const clearSelection = React.useCallback(() => {
    setRowSelection({});
    lastSelectedIndex.current = null;
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!tableRef.current) return;
      const activeElement = document.activeElement;
      const isInsideTable =
        tableRef.current.contains(activeElement) || activeElement === document.body;
      if (!isInsideTable) return;

      if (event.key === "Escape") {
        clearSelection();
        return;
      }

      const currentRow = tableRef.current.querySelector<HTMLElement>(
        '[data-row-index][data-focused="true"]',
      );
      let currentIndex = currentRow
        ? parseInt(currentRow.dataset.rowIndex ?? "-1", 10)
        : -1;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        currentIndex = Math.min(currentIndex + 1, rows.length - 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        currentIndex = Math.max(currentIndex - 1, 0);
      } else {
        return;
      }

      const targetRow = tableRef.current.querySelector<HTMLElement>(
        `[data-row-index="${currentIndex}"]`,
      );
      if (targetRow) {
        targetRow.focus();
        targetRow.dataset.focused = "true";
        if (currentRow && currentRow !== targetRow) {
          delete currentRow.dataset.focused;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearSelection, rows.length]);

  const bulkActions = React.useMemo<BulkAction[]>(() => {
    const actions: BulkAction[] = [
      {
        label: "Export",
        icon: Download,
        onSelect: () => clearSelection(),
      },
    ];

    if (onDelete) {
      actions.push({
        label: "Delete",
        icon: Trash2,
        variant: "danger",
        onSelect: (ids) => {
          onDelete(ids);
          clearSelection();
        },
      });
    }

    return actions;
  }, [clearSelection, onDelete]);

  const rowActions = React.useCallback(
    (order: Order): BulkAction[] => {
      const actions: BulkAction[] = [
        {
          label: "View details",
          icon: Eye,
          onSelect: () => onRowClick(order),
        },
      ];

      if (onCancel && order.status !== "cancelled") {
        actions.push({
          label: cancellingOrderId === order.id ? "Cancelling..." : "Cancel",
          icon: XCircle,
          variant: "danger",
          onSelect: () => onCancel(order),
        });
      }

      if (onRowDelete) {
        actions.push({
          label: deletingOrderId === order.id ? "Deleting..." : "Delete",
          icon: Trash2,
          variant: "danger",
          onSelect: () => onRowDelete(order.id),
        });
      }

      return actions;
    },
    [cancellingOrderId, deletingOrderId, onCancel, onRowClick, onRowDelete],
  );

  const rowHeight = density === "comfortable" ? "h-16" : "h-12";
  const cellPadding = density === "comfortable" ? "px-4 py-4" : "px-4 py-2";

  return (
    <div className="space-y-3" ref={tableRef} tabIndex={-1}>
      {selectedCount > 0 ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
          <span className="text-sm font-semibold text-emerald-900">
            {selectedCount} {selectedCount === 1 ? "order" : "orders"} selected
          </span>
          {selectedCount < allFilteredRowIds.length &&
          allFilteredRowIds.length > pageRowIds.length ? (
            <button
              type="button"
              onClick={selectAllFiltered}
              className="text-sm font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
            >
              Select all {allFilteredRowIds.length} results
            </button>
          ) : null}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {bulkActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => action.onSelect(selectedIds)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition",
                  action.variant === "danger"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                )}
              >
                {action.icon ? <action.icon className="h-4 w-4" /> : null}
                {action.label}
                {action.variant === "danger" ? ` ${selectedCount}` : ""}
              </button>
            ))}
            <button
              type="button"
              onClick={clearSelection}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-slate-500 transition hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-slate-500">
          {totalRows} {totalRows === 1 ? "order" : "orders"} total
        </p>
        <div className="flex items-center gap-2">
          <DetailsMenu
            trigger={
              <Button variant="outline" size="sm">
                {density === "comfortable" ? (
                  <Rows4 className="mr-2 h-4 w-4" />
                ) : (
                  <Rows3 className="mr-2 h-4 w-4" />
                )}
                {density === "comfortable" ? "Comfortable" : "Compact"}
              </Button>
            }
            className="w-44"
          >
            <div className="px-2 py-1.5 text-sm font-semibold">Row density</div>
            <div className="-mx-1 my-1 h-px bg-slate-100" />
            <MenuRadioItem
              checked={density === "comfortable"}
              onSelect={() => onDensityChange("comfortable")}
            >
              Comfortable
            </MenuRadioItem>
            <MenuRadioItem
              checked={density === "compact"}
              onSelect={() => onDensityChange("compact")}
            >
              Compact
            </MenuRadioItem>
          </DetailsMenu>

          <DetailsMenu
            trigger={
              <Button variant="outline" size="sm">
                <Columns3 className="mr-2 h-4 w-4" />
                Columns
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            }
            className="w-44"
          >
            <div className="px-2 py-1.5 text-sm font-semibold">Toggle columns</div>
            <div className="-mx-1 my-1 h-px bg-slate-100" />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <label
                  key={column.id}
                  className="flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-slate-100"
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {column.getIsVisible() ? <X className="h-3 w-3" /> : null}
                  </span>
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={(event) => column.toggleVisibility(event.target.checked)}
                    className="sr-only"
                  />
                  {typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id}
                </label>
              ))}
          </DetailsMenu>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-[1040px]">
            <TableHeader className="sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-slate-200 bg-slate-50/95 backdrop-blur hover:bg-slate-50"
                >
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDirection = header.column.getIsSorted();
                    const isSelectColumn = header.column.id === "select";
                    const meta = header.column.columnDef.meta as
                      | TableColumnMeta
                      | undefined;

                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width:
                            header.getSize() !== 150 ? header.getSize() : undefined,
                        }}
                        className={cn(
                          "text-xs font-semibold uppercase tracking-wide text-slate-500",
                          canSort && "cursor-pointer select-none hover:text-slate-700",
                          meta?.className,
                        )}
                        onClick={
                          canSort ? header.column.getToggleSortingHandler() : undefined
                        }
                      >
                        {header.isPlaceholder ? null : isSelectColumn ? (
                          <TriStateCheckbox
                            checked={isAllPageSelected}
                            indeterminate={isSomePageSelected}
                            onChange={(checked) => togglePageSelection(checked)}
                            ariaLabel="Select all on page"
                          />
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {sortDirection === "asc" ? (
                              <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                            ) : sortDirection === "desc" ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : null}
                          </span>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`} className={rowHeight}>
                    {Array.from({
                      length: table.getVisibleLeafColumns().length,
                    }).map((__, cellIndex) => (
                      <TableCell
                        key={`skeleton-cell-${rowIndex}-${cellIndex}`}
                        className={cellPadding}
                      >
                        <div className="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows.length ? (
                rows.map((row, rowIndex) => (
                  <TableRow
                    key={row.id}
                    data-row-index={rowIndex}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    tabIndex={0}
                    onClick={() => onRowClick(row.original)}
                    className={cn(
                      "cursor-pointer border-slate-100 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400",
                      row.getIsSelected()
                        ? "bg-emerald-50/60 hover:bg-emerald-50"
                        : "hover:bg-slate-50/70",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isSelectColumn = cell.column.id === "select";
                      const isActionColumn = cell.column.id === "action";
                      const meta = cell.column.columnDef.meta as
                        | TableColumnMeta
                        | undefined;

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(cellPadding, "text-slate-700", meta?.className)}
                          onClick={
                            isSelectColumn || isActionColumn
                              ? (event) => event.stopPropagation()
                              : undefined
                          }
                        >
                          {isSelectColumn ? (
                            <input
                              type="checkbox"
                              checked={row.getIsSelected()}
                              onChange={(event) =>
                                toggleRow(
                                  row,
                                  event.target.checked,
                                  (event.nativeEvent as MouseEvent).shiftKey,
                                )
                              }
                              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                              aria-label={`Select order ${row.id}`}
                            />
                          ) : isActionColumn ? (
                            <RowActionsMenu row={row.original} rowActions={rowActions} />
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    {emptyState ?? (
                      <EmptyState
                        compact
                        icon={Inbox}
                        title="No orders to show"
                        description="There are no orders in this view."
                      />
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination table={table} totalRows={totalRows} />
    </div>
  );
}

function TriStateCheckbox({
  checked,
  indeterminate,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
}) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
      aria-label={ariaLabel}
    />
  );
}

function DetailsMenu({
  trigger,
  children,
  className,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 176;
    const left = Math.max(8, triggerRect.right - menuWidth);
    setPosition({
      top: triggerRect.bottom + 6,
      left,
    });
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const handleClose = () => setOpen(false);

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [open]);

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
      >
        {trigger}
      </span>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              style={{ top: position.top, left: position.left }}
              className={cn(
                "fixed z-[100] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-900 shadow-md",
                className,
              )}
            >
              {children}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function MenuRadioItem({
  checked,
  onSelect,
  children,
}: {
  checked: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-left text-sm outline-none transition-colors hover:bg-slate-100"
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked ? <span className="h-2 w-2 rounded-full bg-current" /> : null}
      </span>
      {children}
    </button>
  );
}

function RowActionsMenu({
  row,
  rowActions,
}: {
  row: Order;
  rowActions: (row: Order) => BulkAction[];
}) {
  const actions = rowActions(row);
  if (actions.length === 0) return null;

  return (
    <div className="flex justify-end">
      <DetailsMenu
        trigger={
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        }
        className="w-44"
      >
        {actions.map((action, index) => (
          <React.Fragment key={action.label}>
            {action.variant === "danger" && index > 0 ? (
              <div className="-mx-1 my-1 h-px bg-slate-100" />
            ) : null}
            <button
              type="button"
              onClick={() => action.onSelect([])}
              className={cn(
                "flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-slate-100",
                action.variant === "danger" && "text-red-600 hover:bg-red-50 hover:text-red-700",
              )}
            >
              {action.icon ? <action.icon className="mr-2 h-4 w-4" /> : null}
              {action.label}
            </button>
          </React.Fragment>
        ))}
      </DetailsMenu>
    </div>
  );
}

function DataTablePagination({
  table,
  totalRows,
}: {
  table: ReturnType<typeof useReactTable<Order>>;
  totalRows: number;
}) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalRows);
  const pageCount = table.getPageCount();

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 sm:flex-row">
      <p className="text-sm text-slate-500">
        Showing {start}-{end} of {totalRows} · Page {pageIndex + 1} of{" "}
        {pageCount === 0 ? 1 : pageCount}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function PaymentCell({ order }: { order: Order }) {
  if (order.paymentType === "installment") {
    return (
      <div className="flex flex-col">
        <span className="inline-flex w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          Installment
        </span>
        <span className="mt-0.5 text-xs text-slate-400">
          {order.installmentPlan ?? "Scheduled plan"}
        </span>
      </div>
    );
  }

  return <span className="text-sm text-slate-600">Full Payment</span>;
}
