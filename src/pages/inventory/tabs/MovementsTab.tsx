import { useListMovementsQuery } from "@/api/inventory";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
} from "material-react-table";
import { useMemo, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TopToolbar from "@/components/data-table/TopToolbar";
import BottomToolbar from "@/components/data-table/BottomToolbar";
import type { InventoryMovement } from "@/types/inventory";
import { MovementType, ReferenceType } from "@/types/inventory";
import useDrawer from "@/hooks/useDrawer";
import { Chip } from "@mui/material";
import { formatDateTime } from "../utils";

const movementTypeColors: Record<string, "success" | "error" | "info" | "warning" | "default"> = {
  [MovementType.SALE]: "error",
  [MovementType.RETURN]: "success",
  [MovementType.ADJUSTMENT]: "info",
  [MovementType.PURCHASE]: "success",
  [MovementType.TRANSFER_IN]: "success",
  [MovementType.TRANSFER_OUT]: "error",
  [MovementType.RESERVATION]: "warning",
  [MovementType.RESERVATION_RELEASE]: "info",
  [MovementType.DAMAGED]: "error",
  [MovementType.EXPIRED]: "error",
};

const movementTypeLabels: Record<string, string> = {
  [MovementType.SALE]: "Sale",
  [MovementType.RETURN]: "Return",
  [MovementType.ADJUSTMENT]: "Adjustment",
  [MovementType.PURCHASE]: "Purchase",
  [MovementType.TRANSFER_IN]: "Transfer In",
  [MovementType.TRANSFER_OUT]: "Transfer Out",
  [MovementType.RESERVATION]: "Reserved",
  [MovementType.RESERVATION_RELEASE]: "Released",
  [MovementType.DAMAGED]: "Damaged",
  [MovementType.EXPIRED]: "Expired",
};

const referenceTypeLabels: Record<string, string> = {
  [ReferenceType.ORDER]: "Order",
  [ReferenceType.PURCHASE_ORDER]: "Purchase Order",
  [ReferenceType.TRANSFER]: "Transfer",
  [ReferenceType.MANUAL]: "Manual",
};

export default function MovementsTab() {
  const { drawerWidth, open } = useDrawer();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );

  const { data, isFetching, refetch } = useListMovementsQuery({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
  });

  const movementTypeOptions = useMemo(
    () =>
      Object.values(MovementType).map((type) => ({
        value: type,
        label: movementTypeLabels[type] || type,
      })),
    []
  );

  const columns = useMemo<MRT_ColumnDef<InventoryMovement>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
        size: 80,
        enableColumnFilter: false,
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Date & Time",
        size: 160,
        enableColumnFilter: false,
        Cell: ({ cell }) => formatDateTime(cell.getValue<string>()),
      },
      {
        id: "type",
        accessorKey: "type",
        header: "Type",
        size: 130,
        filterVariant: "select",
        filterSelectOptions: movementTypeOptions,
        Cell: ({ cell }) => {
          const type = cell.getValue<string>();
          return (
            <Chip
              size="small"
              color={movementTypeColors[type] || "default"}
              label={movementTypeLabels[type] || type}
            />
          );
        },
      },
      {
        id: "quantity",
        accessorKey: "quantity",
        header: "Quantity",
        size: 100,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const qty = cell.getValue<number>();
          return (
            <Chip
              size="small"
              color={qty > 0 ? "success" : qty < 0 ? "error" : "default"}
              label={qty > 0 ? `+${qty}` : qty}
            />
          );
        },
      },
      {
        id: "previousQuantity",
        accessorKey: "previousQuantity",
        header: "Before",
        size: 80,
        enableColumnFilter: false,
      },
      {
        id: "newQuantity",
        accessorKey: "newQuantity",
        header: "After",
        size: 80,
        enableColumnFilter: false,
      },
      {
        id: "referenceType",
        accessorKey: "referenceType",
        header: "Reference",
        size: 140,
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const refType = row.original.referenceType;
          const refId = row.original.referenceId;
          if (!refType) return "-";
          return `${referenceTypeLabels[refType] || refType} #${refId || ""}`;
        },
      },
      {
        id: "reason",
        accessorKey: "reason",
        header: "Reason",
        size: 200,
        enableColumnFilter: false,
        Cell: ({ cell }) => cell.getValue<string>() || "-",
      },
      {
        id: "user.name",
        accessorKey: "user.name",
        header: "User",
        size: 120,
        enableColumnFilter: false,
        Cell: ({ row }) => row.original.user?.name || "-",
      },
    ],
    [movementTypeOptions]
  );

  const table = useMaterialReactTable({
    enableFilterMatchHighlighting: false,
    enableFacetedValues: true,
    enableColumnFilters: true,
    paginationDisplayMode: "pages",
    enableStickyHeader: true,
    enableRowSelection: false,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableRowActions: false,
    enableKeyboardShortcuts: true,
    layoutMode: "semantic",
    muiTableContainerProps: {
      sx: {
        minHeight: `calc(100vh - 260px)`,
        maxHeight: `calc(100vh - 260px)`,
        height: "auto",
        width: "auto",
        maxWidth: `calc(100vw - ${open ? drawerWidth : 0}px)`,
      },
    },
    initialState: {
      density: "compact",
      columnFilters: [],
      showColumnFilters: true,
      sorting: [{ id: "createdAt", desc: true }],
    },
    columns,
    data: data?.data || [],
    manualPagination: true,
    autoResetPageIndex: false,
    rowCount: data?.meta?.total || 0,
    state: { isLoading: isFetching, columnFilters, pagination },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    renderTopToolbar: (props) => (
      <TopToolbar {...props} onRefresh={refetch} title="Stock Movement History" />
    ),
    renderBottomToolbar: (props) => <BottomToolbar {...props} />,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
}
