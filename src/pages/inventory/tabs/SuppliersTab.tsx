import {
  useListSuppliersQuery,
  useDeleteSupplierMutation,
} from "@/api/inventory";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TopToolbar from "@/components/data-table/TopToolbar";
import BottomToolbar from "@/components/data-table/BottomToolbar";
import type { Supplier } from "@/types/inventory";
import useDrawer from "@/hooks/useDrawer";
import CustomIconButton from "@/components/IconButton";
import CreateUpdateSupplierModal from "../modals/CreateUpdateSupplierModal";
import { useConfirm } from "material-ui-confirm";
import { Chip } from "@mui/material";

export default function SuppliersTab() {
  const { drawerWidth, open } = useDrawer();
  const confirm = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const { data, isFetching, refetch } = useListSuppliersQuery();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const columns = useMemo<MRT_ColumnDef<Supplier>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
        size: 80,
        enableColumnFilter: false,
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Supplier Name",
        size: 200,
      },
      {
        id: "contactName",
        accessorKey: "contactName",
        header: "Contact Person",
        size: 180,
        Cell: ({ cell }) => cell.getValue<string>() || "-",
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
        size: 200,
        Cell: ({ cell }) => cell.getValue<string>() || "-",
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: "Phone",
        size: 150,
        Cell: ({ cell }) => cell.getValue<string>() || "-",
      },
      {
        id: "address",
        accessorKey: "address",
        header: "Address",
        size: 250,
        Cell: ({ cell }) => cell.getValue<string>() || "-",
      },
      {
        id: "active",
        accessorKey: "active",
        header: "Status",
        size: 100,
        filterVariant: "checkbox",
        Cell: ({ cell }) => (
          <Chip
            size="small"
            color={cell.getValue<boolean>() ? "success" : "default"}
            label={cell.getValue<boolean>() ? "Active" : "Inactive"}
          />
        ),
      },
    ],
    []
  );

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingSupplier(null);
    setModalOpen(true);
  };

  const handleDelete = async (supplier: Supplier) => {
    try {
      await confirm({
        description: `Are you sure you want to delete "${supplier.name}"?`,
        confirmationText: "Delete",
        confirmationButtonProps: { color: "error" },
      });
      await deleteSupplier(supplier.id).unwrap();
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
      showColumnFilters: false,
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
            label: "Add Supplier",
            onClick: handleCreate,
            Icon: AddIcon,
          },
        ]}
      />
    ),
    renderRowActions: ({ row }) => [
      <CustomIconButton
        key="edit"
        Icon={EditIcon}
        tooltip="Edit"
        onClick={() => handleEdit(row.original)}
      />,
      <CustomIconButton
        key="delete"
        Icon={DeleteIcon}
        color="error"
        tooltip="Delete"
        onClick={() => handleDelete(row.original)}
      />,
    ],
    renderBottomToolbar: (props) => <BottomToolbar {...props} />,
  });

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MaterialReactTable table={table} />
      </LocalizationProvider>
      <CreateUpdateSupplierModal
        open={modalOpen}
        setOpen={setModalOpen}
        supplier={editingSupplier}
      />
    </>
  );
}
