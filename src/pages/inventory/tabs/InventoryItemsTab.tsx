import {
  useListInventoryItemsQuery,
  useListLocationsQuery,
} from "@/api/inventory";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
} from "material-react-table";
import { useMemo, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import WarningIcon from "@mui/icons-material/Warning";
import TopToolbar from "@/components/data-table/TopToolbar";
import BottomToolbar from "@/components/data-table/BottomToolbar";
import type { InventoryItem } from "@/types/inventory";
import useDrawer from "@/hooks/useDrawer";
import CustomIconButton from "@/components/IconButton";
import CreateUpdateInventoryItemModal from "../modals/CreateUpdateInventoryItemModal";
import StockAdjustmentModal from "../modals/StockAdjustmentModal";
import { Chip, Tooltip } from "@mui/material";
import { formatCurrency } from "../utils";
import type { MuiTableDropdownOption } from "@/types/common";

export default function InventoryItemsTab() {
  const { drawerWidth, open } = useDrawer();
  const [modalOpen, setModalOpen] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(
    null
  );
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const { data: locationsData } = useListLocationsQuery();

  const locationOptions = useMemo<MuiTableDropdownOption[]>(
    () =>
      locationsData?.data?.map(({ id, name }) => ({ value: id, label: name })) ||
      [],
    [locationsData]
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );

  const { data, isFetching, refetch } = useListInventoryItemsQuery(
    showLowStockOnly ? { lowStockOnly: true } : undefined
  );

  const columns = useMemo<MRT_ColumnDef<InventoryItem>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
        size: 80,
        enableColumnFilter: false,
      },
      {
        id: "product.name",
        accessorKey: "product.name",
        header: "Product",
        size: 200,
        Cell: ({ row }) => row.original.product?.name || "-",
      },
      {
        id: "product.sku",
        accessorKey: "product.sku",
        header: "SKU",
        size: 120,
        Cell: ({ row }) => row.original.product?.sku || "-",
      },
      {
        id: "location.name",
        accessorKey: "location.name",
        header: "Location",
        size: 150,
        filterVariant: "select",
        filterSelectOptions: locationOptions,
        Cell: ({ row }) => row.original.location?.name || "Default",
      },
      {
        id: "quantity",
        accessorKey: "quantity",
        header: "Quantity",
        size: 100,
        filterVariant: "range",
        Cell: ({ row }) => {
          const qty = row.original.quantity;
          const reorderPoint = row.original.reorderPoint;
          const isLow = reorderPoint !== null && qty <= reorderPoint;
          return (
            <Chip
              size="small"
              color={isLow ? "warning" : "default"}
              label={qty}
              icon={isLow ? <WarningIcon /> : undefined}
            />
          );
        },
      },
      {
        id: "reservedQuantity",
        accessorKey: "reservedQuantity",
        header: "Reserved",
        size: 100,
        filterVariant: "range",
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return value > 0 ? (
            <Chip size="small" color="info" label={value} />
          ) : (
            value
          );
        },
      },
      {
        id: "available",
        header: "Available",
        size: 100,
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const available =
            row.original.quantity - row.original.reservedQuantity;
          return (
            <Chip
              size="small"
              color={available > 0 ? "success" : "error"}
              label={available}
            />
          );
        },
      },
      {
        id: "reorderPoint",
        accessorKey: "reorderPoint",
        header: "Reorder Point",
        size: 120,
        Cell: ({ cell }) => cell.getValue<number>() ?? "-",
      },
      {
        id: "reorderQuantity",
        accessorKey: "reorderQuantity",
        header: "Reorder Qty",
        size: 110,
        Cell: ({ cell }) => cell.getValue<number>() ?? "-",
      },
      {
        id: "costPrice",
        accessorKey: "costPrice",
        header: "Cost Price",
        size: 120,
        filterVariant: "range",
        Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      },
    ],
    [locationOptions]
  );

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleAdjust = (item: InventoryItem) => {
    setAdjustingItem(item);
    setAdjustModalOpen(true);
  };

  const table = useMaterialReactTable({
    enableFilterMatchHighlighting: false,
    enableFacetedValues: true,
    enableColumnFilters: true,
    paginationDisplayMode: "pages",
    enableSelectAll: true,
    enableStickyHeader: true,
    enableRowSelection: false,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableRowActions: true,
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
    },
    columns,
    data: data?.data || [],
    manualPagination: false,
    autoResetPageIndex: false,
    rowCount: data?.data?.length || 0,
    state: { isLoading: isFetching, columnFilters, pagination },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    renderTopToolbar: (props) => (
      <TopToolbar
        {...props}
        onRefresh={refetch}
        actions={[
          {
            label: "Add Inventory Item",
            onClick: handleCreate,
            Icon: AddIcon,
          },
          {
            label: showLowStockOnly ? "Show All" : "Low Stock Only",
            onClick: () => setShowLowStockOnly(!showLowStockOnly),
            Icon: WarningIcon,
            variant: showLowStockOnly ? "contained" : "outlined",
            color: showLowStockOnly ? "warning" : "inherit",
          },
        ]}
      />
    ),
    renderRowActions: ({ row }) => [
      <Tooltip key="adjust" title="Adjust Stock">
        <CustomIconButton
          Icon={TuneIcon}
          color="primary"
          onClick={() => handleAdjust(row.original)}
        />
      </Tooltip>,
      <CustomIconButton
        key="edit"
        Icon={EditIcon}
        tooltip="Edit"
        onClick={() => handleEdit(row.original)}
      />,
    ],
    renderBottomToolbar: (props) => <BottomToolbar {...props} />,
  });

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MaterialReactTable table={table} />
      </LocalizationProvider>
      <CreateUpdateInventoryItemModal
        open={modalOpen}
        setOpen={setModalOpen}
        item={editingItem}
      />
      <StockAdjustmentModal
        open={adjustModalOpen}
        setOpen={setAdjustModalOpen}
        item={adjustingItem}
      />
    </>
  );
}
