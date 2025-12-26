import {
  useListLocationsQuery,
  useDeleteLocationMutation,
  useSetDefaultLocationMutation,
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
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import TopToolbar from "@/components/data-table/TopToolbar";
import BottomToolbar from "@/components/data-table/BottomToolbar";
import type { InventoryLocation } from "@/types/inventory";
import useDrawer from "@/hooks/useDrawer";
import CustomIconButton from "@/components/IconButton";
import CreateUpdateLocationModal from "../modals/CreateUpdateLocationModal";
import { useConfirm } from "material-ui-confirm";
import { Chip } from "@mui/material";

export default function LocationsTab() {
  const { drawerWidth, open } = useDrawer();
  const confirm = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] =
    useState<InventoryLocation | null>(null);

  const { data, isFetching, refetch } = useListLocationsQuery();
  const [deleteLocation] = useDeleteLocationMutation();
  const [setDefaultLocation] = useSetDefaultLocationMutation();

  const columns = useMemo<MRT_ColumnDef<InventoryLocation>[]>(
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
        header: "Name",
        size: 200,
      },
      {
        id: "address",
        accessorKey: "address",
        header: "Address",
        size: 300,
        Cell: ({ cell }) => cell.getValue<string>() || "-",
      },
      {
        id: "isDefault",
        accessorKey: "isDefault",
        header: "Default",
        size: 100,
        enableColumnFilter: false,
        Cell: ({ cell }) =>
          cell.getValue<boolean>() ? (
            <Chip size="small" color="primary" label="Default" />
          ) : null,
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

  const handleEdit = (location: InventoryLocation) => {
    setEditingLocation(location);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingLocation(null);
    setModalOpen(true);
  };

  const handleDelete = async (location: InventoryLocation) => {
    try {
      await confirm({
        description: `Are you sure you want to delete "${location.name}"?`,
        confirmationText: "Delete",
        confirmationButtonProps: { color: "error" },
      });
      await deleteLocation(location.id).unwrap();
    } catch {
      // User cancelled or error occurred
    }
  };

  const handleSetDefault = async (location: InventoryLocation) => {
    try {
      await setDefaultLocation(location.id).unwrap();
    } catch {
      // Error occurred
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
            label: "Add Location",
            onClick: handleCreate,
            Icon: AddIcon,
          },
        ]}
      />
    ),
    renderRowActions: ({ row }) => [
      <CustomIconButton
        key="default"
        Icon={row.original.isDefault ? StarIcon : StarBorderIcon}
        color={row.original.isDefault ? "warning" : "inherit"}
        tooltip={row.original.isDefault ? "Default location" : "Set as default"}
        onClick={() => !row.original.isDefault && handleSetDefault(row.original)}
        disabled={row.original.isDefault}
      />,
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
        disabled={row.original.isDefault}
      />,
    ],
    renderBottomToolbar: (props) => <BottomToolbar {...props} />,
  });

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MaterialReactTable table={table} />
      </LocalizationProvider>
      <CreateUpdateLocationModal
        open={modalOpen}
        setOpen={setModalOpen}
        location={editingLocation}
      />
    </>
  );
}
