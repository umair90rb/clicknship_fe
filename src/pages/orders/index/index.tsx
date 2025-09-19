import {
  MaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFullScreenButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton,
  MRT_TablePagination,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToolbarAlertBanner,
  type MRT_ColumnFiltersState,
} from "material-react-table";
import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  useMaterialReactTable,
  MRT_ActionMenuItem,
  type MRT_ColumnDef,
} from "material-react-table";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Text from "@/components/Text";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useLazyListOrdersQuery } from "@/api/orders";

export default function Orders() {
  const columns = useMemo<MRT_ColumnDef<{}>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Order Id",
      },
      {
        accessorKey: "orderNumber",
        header: "Order #",
      },
      {
        id: "name",
        accessorKey: "customer.name",
        header: "Customer Name",
      },
      {
        id: "phone",
        accessorKey: "customer.phone",
        header: "Phone #",
      },
      {
        id: "address",
        accessorKey: "address.address",
        header: "Address",
      },
      {
        id: "city",
        accessorKey: "address.city",
        header: "City",
        filterVariant: "autocomplete",
        filterSelectOptions: ["lahore", "faisalabad"],
      },
      {
        id: "province",
        accessorKey: "address.province",
        header: "Province",
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        filterVariant: "datetime-range",
      },
      {
        accessorKey: "status",
        header: "Status",
        filterVariant: "multi-select",
        filterSelectOptions: ["confirmed", "received"],
      },
      {
        id: "channel",
        accessorKey: "channel.name",
        header: "Channel",
        filterVariant: "select",
        filterSelectOptions: ["channel 1", "channle 2"],
      },
      {
        accessorKey: "totalAmount",
        header: "Total Amount",
        Cell: ({ cell }) =>
          cell.getValue<number>()?.toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
          }),
        filterVariant: "range",
        filterFn: "betweenInclusive",
      },
      {
        accessorKey: "tags",
        header: "Tags",
      },
    ],
    []
  );

  const [fetchOrdersList, { data, isFetching }] = useLazyListOrdersQuery();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );

  useEffect(() => {
    fetchOrdersList({
      skip: pagination.pageIndex * pagination.pageSize,
      take: pagination.pageSize,
    });
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    const filters = columnFilters
      .filter(
        (f) =>
          f.value !== undefined &&
          f.value !== null &&
          f.value !== "" &&
          Array.isArray(f.value) &&
          f.value.length &&
          !f.value.every((e) => e === undefined)
      )
      .reduce((pv, cv) => {
        if (Array.isArray(cv.value)) {
          const [min, max] = cv.value;
          return { ...pv, [cv.id]: { min, max } };
        } else {
          return { ...pv, [cv.id]: cv.value };
        }
      }, {});

    console.log(filters);
    if (Object.keys(filters).length) {
      fetchOrdersList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        ...filters,
      });
    }
  }, [columnFilters]);

  const table = useMaterialReactTable({
    // enableClickToCopy: true,
    // muiCopyButtonProps: {
    //   startIcon: <ContentCopyIcon />,
    // },
    enableSelectAll: false,
    paginationDisplayMode: "pages",
    enableStickyHeader: true,
    enableRowSelection: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableRowActions: true,
    enableKeyboardShortcuts: true,
    layoutMode: "semantic",
    muiTableContainerProps: {
      sx: {
        maxHeight: "none",
        height: "auto",
      },
    },
    initialState: {
      density: "compact",
      columnFilters: [],
      showColumnFilters: true,
      columnVisibility: {
        id: false,
        province: false,
      },
    },
    enableExpandAll: false,
    columns,
    data: data?.data || [],
    manualFiltering: true,
    manualPagination: true,
    autoResetPageIndex: false,
    rowCount: data?.meta?.total || 0,
    state: { isLoading: isFetching, columnFilters, pagination },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    renderTopToolbar: ({ table }) => (
      <Box
        sx={{
          padding: 1,
          gap: "1px",
          display: "flex",
          // justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text variant="body1" bold text="Orders" />
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_GlobalFilterTextField table={table} />
      </Box>
    ),
    renderRowActionMenuItems: ({ table }) => [
      <MRT_ActionMenuItem table={table} icon={<DeleteIcon />} label="Delete" />,
      <MRT_ActionMenuItem table={table} icon={<EditIcon />} label="Edit" />,
    ],
    renderBottomToolbar: ({ table }) => (
      <>
        <Box
          sx={{
            padding: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MRT_TablePagination table={table} />
        </Box>
        <MRT_ToolbarAlertBanner table={table} />
      </>
    ),
    renderDetailPanel: () => (
      <>
        <br></br>
        <br></br>
        <br></br>
      </>
    ),
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />;
    </LocalizationProvider>
  );
}
