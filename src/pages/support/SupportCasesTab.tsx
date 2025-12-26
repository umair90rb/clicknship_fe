import { useListSupportCasesQuery } from "@/api/support";
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
import type {
  SupportCase,
  SupportCaseStatus,
  SupportCasePriority,
} from "@/types/support";
import useDrawer from "@/hooks/useDrawer";
import CreateSupportCaseModal from "./CreateSupportCaseModal";
import ViewSupportCaseModal from "./ViewSupportCaseModal";
import { Chip } from "@mui/material";
import CustomIconButton from "@/components/IconButton";
import dayjs from "dayjs";

const statusColors: Record<
  SupportCaseStatus,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  open: "info",
  in_progress: "primary",
  pending_info: "warning",
  resolved: "success",
  closed: "default",
};

const statusLabels: Record<SupportCaseStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  pending_info: "Pending Info",
  resolved: "Resolved",
  closed: "Closed",
};

const priorityColors: Record<
  SupportCasePriority,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  low: "default",
  medium: "info",
  high: "warning",
  critical: "error",
};

const priorityLabels: Record<SupportCasePriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export default function SupportCasesTab() {
  const { drawerWidth, open } = useDrawer();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const handleViewCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setViewModalOpen(true);
  };

  const columns = useMemo<MRT_ColumnDef<SupportCase>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
        size: 300,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        size: 140,
        filterVariant: "select",
        filterSelectOptions: Object.entries(statusLabels).map(
          ([value, label]) => ({
            value,
            label,
          })
        ),
        Cell: ({ cell }) => {
          const status = cell.getValue<SupportCaseStatus>();
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
        id: "priority",
        accessorKey: "priority",
        header: "Priority",
        size: 120,
        filterVariant: "select",
        filterSelectOptions: Object.entries(priorityLabels).map(
          ([value, label]) => ({
            value,
            label,
          })
        ),
        Cell: ({ cell }) => {
          const priority = cell.getValue<SupportCasePriority>();
          return (
            <Chip
              label={priorityLabels[priority]}
              color={priorityColors[priority]}
              size="small"
              variant="outlined"
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
        header: "Created",
        size: 150,
        enableColumnFilter: false,
        Cell: ({ cell }) => dayjs(cell.getValue<string>()).format("MMM D, YYYY"),
      },
      {
        id: "resolvedAt",
        accessorKey: "resolvedAt",
        header: "Resolved",
        size: 150,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const value = cell.getValue<string | null>();
          return value ? dayjs(value).format("MMM D, YYYY") : "-";
        },
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
      } else if (filter.id === "priority") {
        result.priority = filter.value;
      } else if (filter.id === "title") {
        result.title = filter.value;
      }
    });
    return result;
  }, [columnFilters]);

  const { data, isFetching } = useListSupportCasesQuery({
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
            label: "Create Case",
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
        onClick={() => handleViewCase(row.original.id)}
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
      <CreateSupportCaseModal
        open={createModalOpen}
        setOpen={setCreateModalOpen}
      />
      <ViewSupportCaseModal
        open={viewModalOpen}
        setOpen={setViewModalOpen}
        caseId={selectedCaseId}
      />
    </>
  );
}
