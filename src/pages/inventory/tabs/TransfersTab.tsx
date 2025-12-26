import {
  useListTransfersQuery,
  useDeleteTransferMutation,
  useCancelTransferMutation,
  useMarkTransferInTransitMutation,
  useCompleteTransferMutation,
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TopToolbar from "@/components/data-table/TopToolbar";
import BottomToolbar from "@/components/data-table/BottomToolbar";
import type { StockTransfer } from "@/types/inventory";
import { TransferStatus } from "@/types/inventory";
import useDrawer from "@/hooks/useDrawer";
import CustomIconButton from "@/components/IconButton";
import CreateTransferModal from "../modals/CreateTransferModal";
import ViewTransferModal from "../modals/ViewTransferModal";
import { useConfirm } from "material-ui-confirm";
import { Chip } from "@mui/material";
import { formatDateTime } from "../utils";

const statusColors: Record<string, "default" | "primary" | "warning" | "success" | "error"> = {
  [TransferStatus.PENDING]: "default",
  [TransferStatus.IN_TRANSIT]: "warning",
  [TransferStatus.COMPLETED]: "success",
  [TransferStatus.CANCELLED]: "error",
};

const statusLabels: Record<string, string> = {
  [TransferStatus.PENDING]: "Pending",
  [TransferStatus.IN_TRANSIT]: "In Transit",
  [TransferStatus.COMPLETED]: "Completed",
  [TransferStatus.CANCELLED]: "Cancelled",
};

export default function TransfersTab() {
  const { drawerWidth, open } = useDrawer();
  const confirm = useConfirm();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<StockTransfer | null>(null);

  const { data, isFetching, refetch } = useListTransfersQuery();
  const [deleteTransfer] = useDeleteTransferMutation();
  const [cancelTransfer] = useCancelTransferMutation();
  const [markInTransit] = useMarkTransferInTransitMutation();
  const [completeTransfer] = useCompleteTransferMutation();

  const statusOptions = useMemo(
    () =>
      Object.values(TransferStatus).map((status) => ({
        value: status,
        label: statusLabels[status],
      })),
    []
  );

  const columns = useMemo<MRT_ColumnDef<StockTransfer>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
        size: 80,
        enableColumnFilter: false,
      },
      {
        id: "transferNumber",
        accessorKey: "transferNumber",
        header: "Transfer #",
        size: 140,
        enableClickToCopy: true,
      },
      {
        id: "fromLocation.name",
        accessorKey: "fromLocation.name",
        header: "From Location",
        size: 160,
        Cell: ({ row }) => row.original.fromLocation?.name || "-",
      },
      {
        id: "toLocation.name",
        accessorKey: "toLocation.name",
        header: "To Location",
        size: 160,
        Cell: ({ row }) => row.original.toLocation?.name || "-",
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        size: 130,
        filterVariant: "select",
        filterSelectOptions: statusOptions,
        Cell: ({ cell }) => {
          const status = cell.getValue<TransferStatus>();
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
        id: "initiatedAt",
        accessorKey: "initiatedAt",
        header: "Initiated",
        size: 160,
        enableColumnFilter: false,
        Cell: ({ cell }) => formatDateTime(cell.getValue<string>()),
      },
      {
        id: "completedAt",
        accessorKey: "completedAt",
        header: "Completed",
        size: 160,
        enableColumnFilter: false,
        Cell: ({ cell }) => formatDateTime(cell.getValue<string>()),
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

  const handleView = (transfer: StockTransfer) => {
    setSelectedTransfer(transfer);
    setViewModalOpen(true);
  };

  const handleMarkInTransit = async (transfer: StockTransfer) => {
    try {
      await confirm({
        description: `Mark transfer "${transfer.transferNumber}" as in transit?`,
        confirmationText: "Mark In Transit",
      });
      await markInTransit(transfer.id).unwrap();
    } catch {
      // User cancelled or error occurred
    }
  };

  const handleComplete = async (transfer: StockTransfer) => {
    try {
      await confirm({
        description: `Complete transfer "${transfer.transferNumber}"?`,
        confirmationText: "Complete Transfer",
      });
      await completeTransfer(transfer.id).unwrap();
    } catch {
      // User cancelled or error occurred
    }
  };

  const handleCancel = async (transfer: StockTransfer) => {
    try {
      await confirm({
        description: `Are you sure you want to cancel transfer "${transfer.transferNumber}"?`,
        confirmationText: "Cancel Transfer",
        confirmationButtonProps: { color: "error" },
      });
      await cancelTransfer(transfer.id).unwrap();
    } catch {
      // User cancelled or error occurred
    }
  };

  const handleDelete = async (transfer: StockTransfer) => {
    try {
      await confirm({
        description: `Are you sure you want to delete transfer "${transfer.transferNumber}"?`,
        confirmationText: "Delete",
        confirmationButtonProps: { color: "error" },
      });
      await deleteTransfer(transfer.id).unwrap();
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
            label: "Create Transfer",
            onClick: () => setCreateModalOpen(true),
            Icon: AddIcon,
          },
        ]}
      />
    ),
    renderRowActions: ({ row }) => {
      const transfer = row.original;
      const isPending = transfer.status === TransferStatus.PENDING;
      const isInTransit = transfer.status === TransferStatus.IN_TRANSIT;
      const canCancel = isPending || isInTransit;

      return [
        <CustomIconButton
          key="view"
          Icon={VisibilityIcon}
          tooltip="View Details"
          onClick={() => handleView(transfer)}
        />,
        isPending && (
          <CustomIconButton
            key="transit"
            Icon={LocalShippingIcon}
            color="warning"
            tooltip="Mark In Transit"
            onClick={() => handleMarkInTransit(transfer)}
          />
        ),
        isInTransit && (
          <CustomIconButton
            key="complete"
            Icon={CheckCircleIcon}
            color="success"
            tooltip="Complete Transfer"
            onClick={() => handleComplete(transfer)}
          />
        ),
        canCancel && (
          <CustomIconButton
            key="cancel"
            Icon={CancelIcon}
            color="error"
            tooltip="Cancel Transfer"
            onClick={() => handleCancel(transfer)}
          />
        ),
        isPending && (
          <CustomIconButton
            key="delete"
            Icon={DeleteIcon}
            color="error"
            tooltip="Delete"
            onClick={() => handleDelete(transfer)}
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
      <CreateTransferModal
        open={createModalOpen}
        setOpen={setCreateModalOpen}
      />
      <ViewTransferModal
        open={viewModalOpen}
        setOpen={setViewModalOpen}
        transfer={selectedTransfer}
      />
    </>
  );
}
