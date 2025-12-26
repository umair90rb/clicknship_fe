import { useListFeedbackQuery, useGetFeedbackStatsQuery } from "@/api/support";
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
import TopToolbar from "@/components/data-table/TopToolbar";
import BottomToolbar from "@/components/data-table/BottomToolbar";
import type { Feedback, FeedbackCategory } from "@/types/support";
import useDrawer from "@/hooks/useDrawer";
import CreateFeedbackModal from "./CreateFeedbackModal";
import { Box, Card, CardContent, Chip, Rating, Typography } from "@mui/material";
import dayjs from "dayjs";

const categoryColors: Record<FeedbackCategory, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
  feature: "primary",
  module: "secondary",
  general: "default",
  ui_ux: "info",
  performance: "warning",
};

const categoryLabels: Record<FeedbackCategory, string> = {
  feature: "Feature",
  module: "Module",
  general: "General",
  ui_ux: "UI/UX",
  performance: "Performance",
};

function FeedbackStats() {
  const { data } = useGetFeedbackStatsQuery();
  const stats = data?.data;

  if (!stats) return null;

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <Card sx={{ minWidth: 150 }}>
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Typography variant="body2" color="text.secondary">
            Total Feedback
          </Typography>
          <Typography variant="h5">{stats.total}</Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 150 }}>
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Typography variant="body2" color="text.secondary">
            Average Rating
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h5">
              {stats.averageStars?.toFixed(1) || "N/A"}
            </Typography>
            {stats.averageStars && (
              <Rating value={stats.averageStars} readOnly size="small" precision={0.1} />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function FeedbackTab() {
  const { drawerWidth, open } = useDrawer();
  const [modalOpen, setModalOpen] = useState(false);

  const columns = useMemo<MRT_ColumnDef<Feedback>[]>(
    () => [
      {
        id: "stars",
        accessorKey: "stars",
        header: "Rating",
        size: 150,
        enableColumnFilter: false,
        Cell: ({ cell }) => (
          <Rating value={cell.getValue<number>()} readOnly size="small" />
        ),
      },
      {
        id: "category",
        accessorKey: "category",
        header: "Category",
        size: 120,
        filterVariant: "select",
        filterSelectOptions: Object.entries(categoryLabels).map(([value, label]) => ({
          value,
          label,
        })),
        Cell: ({ cell }) => {
          const category = cell.getValue<FeedbackCategory>();
          return (
            <Chip
              label={categoryLabels[category]}
              color={categoryColors[category]}
              size="small"
            />
          );
        },
      },
      {
        id: "description",
        accessorKey: "description",
        header: "Description",
        enableColumnFilter: false,
        size: 400,
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
        header: "Date",
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

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

  const filters = useMemo(() => {
    const result: Record<string, unknown> = {};
    columnFilters.forEach((filter) => {
      if (filter.id === "category") {
        result.category = filter.value;
      }
    });
    return result;
  }, [columnFilters]);

  const { data, isFetching } = useListFeedbackQuery({
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
    enableKeyboardShortcuts: true,
    layoutMode: "semantic",
    muiTableContainerProps: {
      sx: {
        minHeight: `calc(100vh - 280px)`,
        maxHeight: `calc(100vh - 280px)`,
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
            label: "Submit Feedback",
            onClick: () => setModalOpen(true),
            Icon: AddIcon,
          },
        ]}
      />
    ),
    renderBottomToolbar: (props) => <BottomToolbar {...props} />,
  });

  return (
    <>
      <FeedbackStats />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MaterialReactTable table={table} />
      </LocalizationProvider>
      <CreateFeedbackModal open={modalOpen} setOpen={setModalOpen} />
    </>
  );
}
