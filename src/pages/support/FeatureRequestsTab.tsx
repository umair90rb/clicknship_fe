import { useListFeatureRequestsQuery } from "@/api/support";
import {
  MaterialReactTable,
  type MRT_ColumnFiltersState,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TopToolbar from "@/components/data-table/TopToolbar";
import BottomToolbar from "@/components/data-table/BottomToolbar";
import type { FeatureRequest, FeatureRequestStatus } from "@/types/support";
import useDrawer from "@/hooks/useDrawer";
import CreateFeatureRequestModal from "./CreateFeatureRequestModal";
import ViewFeatureRequestModal from "./ViewFeatureRequestModal";
import { Chip } from "@mui/material";
import CustomIconButton from "@/components/IconButton";
import dayjs from "dayjs";

const statusColors: Record<
  FeatureRequestStatus,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  submitted: "info",
  under_review: "primary",
  planned: "secondary",
  in_development: "warning",
  completed: "success",
  rejected: "error",
};

const statusLabels: Record<FeatureRequestStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  planned: "Planned",
  in_development: "In Development",
  completed: "Completed",
  rejected: "Rejected",
};

export default function FeatureRequestsTab() {
  const { drawerWidth, open } = useDrawer();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );

  const handleViewRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setViewModalOpen(true);
  };

  const columns = useMemo<MRT_ColumnDef<FeatureRequest>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
        size: 350,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        size: 150,
        filterVariant: "select",
        filterSelectOptions: Object.entries(statusLabels).map(
          ([value, label]) => ({
            value,
            label,
          })
        ),
        Cell: ({ cell }) => {
          const status = cell.getValue<FeatureRequestStatus>();
          return (
            <Chip
              label={statusLabels[status]}
              color={statusColors[status]}
              size="small"
            />
          );
        },
      },
      {
        id: "userEmail",
        accessorKey: "userEmail",
        header: "Submitted By",
        size: 200,
        enableColumnFilter: false,
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Submitted",
        size: 150,
        enableColumnFilter: false,
        Cell: ({ cell }) => dayjs(cell.getValue<string>()).format("MMM D, YYYY"),
      },
      {
        id: "updatedAt",
        accessorKey: "updatedAt",
        header: "Last Updated",
        size: 150,
        enableColumnFilter: false,
        Cell: ({ cell }) => dayjs(cell.getValue<string>()).format("MMM D, YYYY"),
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

  const filters = useMemo(() => {
    const result: Record<string, unknown> = {};
    columnFilters.forEach((filter) => {
      if (filter.id === "status") {
        result.status = filter.value;
      } else if (filter.id === "title") {
        result.title = filter.value;
      }
    });
    return result;
  }, [columnFilters]);

  const { data, isFetching } = useListFeatureRequestsQuery({
    skip: pagination.pageIndex * pagination.pageSize,
    take: pagination.pageSize,
    ...filters,
  });

  const table = useMaterialReactTable({
    enableFilterMatchHighlighting: false,
    enableFacetedValues: true,
    enableColumnFilters: true,
    paginationDisplayMode: "pages",
    enableStickyHeader: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableRowActions: true,
    enableKeyboardShortcuts: true,
    layoutMode: "semantic",
    positionActionsColumn: "last",
    muiTableContainerProps: {
      sx: {
        minHeight: `calc(100vh - 220px)`,
        maxHeight: `calc(100vh - 220px)`,
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
        actions={[
          {
            label: "Request Feature",
            onClick: () => setCreateModalOpen(true),
            Icon: AddIcon,
          },
        ]}
      />
    ),
    renderRowActions: ({ row }) => [
      <CustomIconButton
        key="view"
        Icon={VisibilityIcon}
        onClick={() => handleViewRequest(row.original.id)}
        size="small"
      />,
    ],
    renderBottomToolbar: (props) => <BottomToolbar {...props} />,
  });

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MaterialReactTable table={table} />
      </LocalizationProvider>
      <CreateFeatureRequestModal
        open={createModalOpen}
        setOpen={setCreateModalOpen}
      />
      <ViewFeatureRequestModal
        open={viewModalOpen}
        setOpen={setViewModalOpen}
        requestId={selectedRequestId}
      />
    </>
  );
}
