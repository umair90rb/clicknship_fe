import {
  useListPurchaseOrdersQuery,
  useDeletePurchaseOrderMutation,
  useCancelPurchaseOrderMutation,
  useMarkPurchaseOrderOrderedMutation,
} from "@/api/inventory";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import CancelIcon from "@mui/icons-material/Cancel";
import TopToolbar from "@/components/data-table/TopToolbar";
import BottomToolbar from "@/components/data-table/BottomToolbar";
import type { PurchaseOrder } from "@/types/inventory";
import { PurchaseOrderStatus } from "@/types/inventory";
import useDrawer from "@/hooks/useDrawer";
import CustomIconButton from "@/components/IconButton";
import CreatePurchaseOrderModal from "../modals/CreatePurchaseOrderModal";
import ReceivePurchaseOrderModal from "../modals/ReceivePurchaseOrderModal";
import ViewPurchaseOrderModal from "../modals/ViewPurchaseOrderModal";
import { useConfirm } from "material-ui-confirm";
import { Chip } from "@mui/material";
import { formatCurrency, formatDate } from "../utils";

const statusColors: Record<string, "default" | "primary" | "warning" | "success" | "error"> = {
  [PurchaseOrderStatus.DRAFT]: "default",
  [PurchaseOrderStatus.ORDERED]: "primary",
  [PurchaseOrderStatus.PARTIAL]: "warning",
  [PurchaseOrderStatus.RECEIVED]: "success",
  [PurchaseOrderStatus.CANCELLED]: "error",
};

const statusLabels: Record<string, string> = {
  [PurchaseOrderStatus.DRAFT]: "Draft",
  [PurchaseOrderStatus.ORDERED]: "Ordered",
  [PurchaseOrderStatus.PARTIAL]: "Partially Received",
  [PurchaseOrderStatus.RECEIVED]: "Received",
  [PurchaseOrderStatus.CANCELLED]: "Cancelled",
};

export default function PurchaseOrdersTab() {
  const { drawerWidth, open } = useDrawer();
  const confirm = useConfirm();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const { data, isFetching, refetch } = useListPurchaseOrdersQuery();
  const [deletePO] = useDeletePurchaseOrderMutation();
  const [cancelPO] = useCancelPurchaseOrderMutation();
  const [markOrdered] = useMarkPurchaseOrderOrderedMutation();

  const statusOptions = useMemo(
    () =>
      Object.values(PurchaseOrderStatus).map((status) => ({
        value: status,
        label: statusLabels[status],
      })),
    []
  );

  const columns = useMemo<MRT_ColumnDef<PurchaseOrder>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
        size: 80,
        enableColumnFilter: false,
      },
      {
        id: "poNumber",
        accessorKey: "poNumber",
        header: "PO Number",
        size: 140,
        enableClickToCopy: true,
      },
      {
        id: "supplier.name",
        accessorKey: "supplier.name",
        header: "Supplier",
        size: 180,
        Cell: ({ row }) => row.original.supplier?.name || "-",
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        size: 150,
        filterVariant: "select",
        filterSelectOptions: statusOptions,
        Cell: ({ cell }) => {
          const status = cell.getValue<PurchaseOrderStatus>();
          return (
            <Chip
              size="small"
              color={statusColors[status] || "default"}
              label={statusLabels[status] || status}
            />
          );
        },
      },
      {
        id: "orderDate",
        accessorKey: "orderDate",
        header: "Order Date",
        size: 120,
        enableColumnFilter: false,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        id: "expectedDate",
        accessorKey: "expectedDate",
        header: "Expected Date",
        size: 130,
        enableColumnFilter: false,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        id: "totalAmount",
        accessorKey: "totalAmount",
        header: "Total Amount",
        size: 130,
        enableColumnFilter: false,
        Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      },
      {
        id: "notes",
        accessorKey: "notes",
        header: "Notes",
        size: 200,
        enableColumnFilter: false,
        Cell: ({ cell }) => cell.getValue<string>() || "-",
      },
    ],
    [statusOptions]
  );

  const handleView = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setViewModalOpen(true);
  };

  const handleReceive = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setReceiveModalOpen(true);
  };

  const handleMarkOrdered = async (po: PurchaseOrder) => {
    try {
      await confirm({
        description: `Mark PO "${po.poNumber}" as ordered?`,
        confirmationText: "Mark Ordered",
      });
      await markOrdered(po.id).unwrap();
    } catch {
      // User cancelled or error occurred
    }
  };

  const handleCancel = async (po: PurchaseOrder) => {
    try {
      await confirm({
        description: `Are you sure you want to cancel PO "${po.poNumber}"?`,
        confirmationText: "Cancel PO",
        confirmationButtonProps: { color: "error" },
      });
      await cancelPO(po.id).unwrap();
    } catch {
      // User cancelled or error occurred
    }
  };

  const handleDelete = async (po: PurchaseOrder) => {
    try {
      await confirm({
        description: `Are you sure you want to delete PO "${po.poNumber}"?`,
        confirmationText: "Delete",
        confirmationButtonProps: { color: "error" },
      });
      await deletePO(po.id).unwrap();
    } catch {
      // User cancelled or error occurred
    }
  };

  const table = useMaterialReactTable({
    enableFilterMatchHighlighting: false,
    enableFacetedValues: true,
    enableColumnFilters: true,
    paginationDisplayMode: "pages",
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
      showColumnFilters: true,
      sorting: [{ id: "id", desc: true }],
    },
    columns,
    data: data?.data || [],
    state: { isLoading: isFetching },
    renderTopToolbar: (props) => (
      <TopToolbar
        {...props}
        onRefresh={refetch}
        actions={[
          {
            label: "Create PO",
            onClick: () => setCreateModalOpen(true),
            Icon: AddIcon,
          },
        ]}
      />
    ),
    renderRowActions: ({ row }) => {
      const po = row.original;
      const isDraft = po.status === PurchaseOrderStatus.DRAFT;
      const isOrdered = po.status === PurchaseOrderStatus.ORDERED;
      const isPartial = po.status === PurchaseOrderStatus.PARTIAL;
      const canReceive = isOrdered || isPartial;
      const canCancel = isDraft || isOrdered || isPartial;

      return [
        <CustomIconButton
          key="view"
          Icon={VisibilityIcon}
          tooltip="View Details"
          onClick={() => handleView(po)}
        />,
        isDraft && (
          <CustomIconButton
            key="order"
            Icon={LocalShippingIcon}
            color="primary"
            tooltip="Mark as Ordered"
            onClick={() => handleMarkOrdered(po)}
          />
        ),
        canReceive && (
          <CustomIconButton
            key="receive"
            Icon={InventoryIcon}
            color="success"
            tooltip="Receive Items"
            onClick={() => handleReceive(po)}
          />
        ),
        canCancel && (
          <CustomIconButton
            key="cancel"
            Icon={CancelIcon}
            color="warning"
            tooltip="Cancel PO"
            onClick={() => handleCancel(po)}
          />
        ),
        isDraft && (
          <CustomIconButton
            key="delete"
            Icon={DeleteIcon}
            color="error"
            tooltip="Delete"
            onClick={() => handleDelete(po)}
          />
        ),
      ].filter(Boolean);
    },
    renderBottomToolbar: (props) => <BottomToolbar {...props} />,
  });

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MaterialReactTable table={table} />
      </LocalizationProvider>
      <CreatePurchaseOrderModal
        open={createModalOpen}
        setOpen={setCreateModalOpen}
      />
      <ViewPurchaseOrderModal
        open={viewModalOpen}
        setOpen={setViewModalOpen}
        purchaseOrder={selectedPO}
      />
      <ReceivePurchaseOrderModal
        open={receiveModalOpen}
        setOpen={setReceiveModalOpen}
        purchaseOrder={selectedPO}
      />
    </>
  );
}
