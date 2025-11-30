import CreateUpdateIntegrationModal from "./CreateUpdateIntegraionModal";
import useDrawer from "@/hooks/useDrawer";
import {
  MaterialReactTable,
  type MRT_ColumnFiltersState,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { buildFilters } from "../orders/utils";
import TopToolbar from "@/components/data-table/TopToolbar";
import BottomToolbar from "@/components/data-table/BottomToolbar";
import type { CourierIntegration } from "@/types/courier";
import { useListCourierIntegrationQuery } from "@/api/courier";
import CustomIconButton from "@/components/IconButton";

export default function CourierServices() {
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false);
  const { drawerWidth, open } = useDrawer();

  const columns = useMemo<MRT_ColumnDef<CourierIntegration>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Id",
        maxSize: 2,
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
      },
      {
        id: "courier",
        accessorKey: "courier",
        header: "Courier",
      },
      {
        id: "returnAddress",
        accessorKey: "returnAddress",
        header: "Return Address",
        enableClickToCopy: true,
      },
      {
        id: "dispatchAddress",
        accessorKey: "dispatchAddress",
        header: "Dispatch Address",
        enableClickToCopy: true,
      },
      {
        id: "active",
        accessorFn: (originalRow) => (originalRow.active ? "true" : "false"),
        header: "Active Status",
        filterVariant: "checkbox",
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

  const { data, isFetching } = useListCourierIntegrationQuery(
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
    enableSelectAll: false,
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
    state: { isLoading: isFetching, columnFilters, pagination },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    renderTopToolbar: (props) => (
      <TopToolbar
        {...props}
        title="Integrated Courier Services"
        actions={[
          {
            label: "Add New Integration",
            onClick() {
              setIntegrationModalOpen(true);
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
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MaterialReactTable table={table} />
      </LocalizationProvider>
      <CreateUpdateIntegrationModal
        open={integrationModalOpen}
        setOpen={setIntegrationModalOpen}
      />
    </>
  );
}
