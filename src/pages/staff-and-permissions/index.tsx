import { Grid } from "@mui/material";
import CreateUpdateAndRoleList from "./CreateUpdateAndRoleList";
import { useListUserQuery } from "@/api/user";
import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
} from "material-react-table";
import type { User } from "@/types/users";
import TopToolbar from "@/components/data-table/TopToolbar";
import CustomIconButton from "@/components/IconButton";
import BottomToolbar from "@/components/data-table/BottomToolbar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { buildFilters } from "../orders/utils";
import useDrawer from "@/hooks/useDrawer";
import CreateUpdateUserModal from "./CreateUpdateUser";

export default function StaffAndPermissions() {
  const { drawerWidth, open } = useDrawer();
  const [userModalOpen, setUserModalOpen] = useState(false);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "User Id",
        enableEditing: false,
        enableColumnFilter: false,
        enableSorting: false,
        enableColumnOrdering: false,
        maxSize: 1,
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: "Phone",
        enableClickToCopy: true,
      },
      {
        id: "role",
        accessorKey: "role.name",
        header: "User Role",
        enableColumnFilter: false,
      },
    ],
    []
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const filters = buildFilters(columnFilters);

  const { data, isLoading } = useListUserQuery(
    {
      skip: pagination.pageIndex * pagination.pageSize,
      take: pagination.pageSize,
      ...filters,
    },
    {}
  );

  const table = useMaterialReactTable({
    // enableClickToCopy: true,
    // muiCopyButtonProps: {
    //   startIcon: <ContentCopyIcon />,
    // },
    enableFilterMatchHighlighting: false,
    enableFacetedValues: true,
    enableColumnFilters: true,
    paginationDisplayMode: "pages",
    enableSelectAll: true,
    enableStickyHeader: true,
    enableRowSelection: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableRowActions: true,
    enableKeyboardShortcuts: true,
    layoutMode: "semantic",
    muiTableContainerProps: {
      sx: {
        minHeight: `calc(100vh - 160px)`,
        maxHeight: `calc(100vh - 160px)`,
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
    manualFiltering: true,
    manualPagination: true,
    autoResetPageIndex: false,
    rowCount: data?.meta?.total || 0,
    state: { isLoading, columnFilters, pagination },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    renderTopToolbar: (props) => (
      <TopToolbar
        {...props}
        title="Staff Accounts"
        actions={[
          {
            label: "Add New Account",
            onClick() {
              setUserModalOpen(true);
            },
            Icon: AddIcon,
          },
        ]}
      />
    ),
    renderRowActions: ({ table, row }) => [
      <CustomIconButton Icon={DeleteIcon} color="error" onClick={() => {}} />,
      <CustomIconButton
        Icon={EditIcon}
        onClick={() => table.setEditingRow(row)}
      />,
    ],
    renderBottomToolbar: (props) => <BottomToolbar {...props} />,
  });

  return (
    <Grid container spacing={1}>
      <Grid
        borderRight={"0.5px solid lightgrey"}
        size={{ xs: 12, sm: 8, md: 8 }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MaterialReactTable table={table} />
        </LocalizationProvider>
      </Grid>
      <Grid size={{ xs: 12, sm: 4, md: 4 }}>
        <CreateUpdateAndRoleList />
      </Grid>
      <CreateUpdateUserModal open={userModalOpen} setOpen={setUserModalOpen} />
    </Grid>
  );
}
