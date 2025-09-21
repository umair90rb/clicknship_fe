import {
  MaterialReactTable,
  type MRT_ColumnFiltersState,
} from "material-react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useMaterialReactTable,
  MRT_ActionMenuItem,
  type MRT_ColumnDef,
} from "material-react-table";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useLazyListOrdersQuery } from "@/api/orders";
import BottomToolbar from "@/components/table/BottomToolbar";
import TopToolbar from "@/components/table/TopToolbar";
import { buildFilters } from "./utils";
import dayjs from "dayjs";
import OrderDetailPanel from "./components/OrderDetailPanel";
import type { Order } from "@/types/orders/list";
import { DATE_FORMAT } from "@/constants/keys";

export default function Orders() {
  const columns = useMemo<MRT_ColumnDef<Order>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Order Id",
        enableColumnFilter: false,
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
        enableFacetedValues: true,
        // filterSelectOptions: ["lahore", "faisalabad"],
      },
      {
        id: "province",
        accessorKey: "address.province",
        header: "Province",
        enableColumnFilter: false,
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        filterVariant: "datetime-range",
        Cell: ({ cell }) => {
          const date = cell.getValue<string>();
          return date ? dayjs(date).format(DATE_FORMAT) : "-";
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        filterVariant: "multi-select",
        // filterSelectOptions: ["confirmed", "received"],
        enableFacetedValues: true,
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
        header: "T. Amount",
        Cell: ({ cell }) =>
          cell.getValue<number>()?.toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
          }),
        filterVariant: "range",
      },
      {
        accessorKey: "tags",
        header: "Tags",
        filterVariant: "multi-select",
        filterSelectOptions: ["new", "updated", "duplicate"],
      },
    ],
    []
  );

  const [fetchOrdersList, { data, isFetching: isLoading }] =
    useLazyListOrdersQuery();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      fetchOrdersList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        ...buildFilters(columnFilters),
      });
      return;
    }

    const handler = setTimeout(() => {
      const filters = buildFilters(columnFilters);
      console.log(filters);
      fetchOrdersList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        ...filters,
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [pagination.pageIndex, pagination.pageSize, columnFilters]);

  const table = useMaterialReactTable({
    // enableClickToCopy: true,
    // muiCopyButtonProps: {
    //   startIcon: <ContentCopyIcon />,
    // },
    enableFilterMatchHighlighting: false,
    enableFacetedValues: true,
    enableColumnFilters: true,
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
    state: { isLoading, columnFilters, pagination },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    renderTopToolbar: (props) => <TopToolbar title="Orders" {...props} />,
    renderRowActionMenuItems: ({ table }) => [
      <MRT_ActionMenuItem table={table} icon={<DeleteIcon />} label="Delete" />,
      <MRT_ActionMenuItem table={table} icon={<EditIcon />} label="Edit" />,
    ],
    renderBottomToolbar: (props) => <BottomToolbar {...props} />,
    renderDetailPanel: (props) => <OrderDetailPanel {...props} />,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
}
