import {
  MaterialReactTable,
  type MRT_ColumnFiltersState,
  useMaterialReactTable,
  MRT_ActionMenuItem,
  type MRT_ColumnDef,
} from "material-react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useLazyListOrdersQuery } from "@/api/orders";
import BottomToolbar from "@/components/data-table/BottomToolbar";
import TopToolbar from "@/components/data-table/TopToolbar";
import { buildFilters } from "../utils";
import dayjs from "dayjs";
import OrderDetailPanel from "./components/OrderDetailPanel";
import type { Order } from "@/types/orders/list";
import { DATE_FORMAT } from "@/constants/keys";
import useDrawer from "@/hooks/useDrawer";
import { useNavigate } from "react-router";
import { useConfirmSelect } from "@/components/ConfirmSelection";
import { useListCourierIntegrationQuery } from "@/api/courier";
import { useCancelBookingMutation, useCreateBookingMutation } from "@/api/booking";
import { OrderStatus } from "@/constants/order";
import { useConfirm } from "material-ui-confirm";

export default function Orders() {
  const { drawerWidth, open } = useDrawer();
  const navigate = useNavigate();
  const confirm = useConfirm();
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

  const confirmSelect = useConfirmSelect();
  const { data: courierList, isFetching: isCourierListFetching } =
    useListCourierIntegrationQuery({});
  const [
    createBooking,
    {
      // data: createBookingResponse,
      isLoading: createBookingIsLoading,
      // isSuccess: createBookingIsSuccess,
      // error: createBookingError,
    },
  ] = useCreateBookingMutation();
  const [cancelBooking, 
    // {
    //   data: cancelBookingResponse,
    //   isLoading: cancelBookingIsLoading,
    //   isSuccess: cancelBookingIsSuccess,
    //   error: cancelBookingError,
    // }
  ] = useCancelBookingMutation();
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

  const fetchOrders = useCallback(
    () =>
      fetchOrdersList({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        ...buildFilters(columnFilters),
      }),
    [pagination.pageIndex, pagination.pageSize, columnFilters]
  );

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      fetchOrders();
      return;
    }

    const handler = setTimeout(() => {
      // const filters = buildFilters(columnFilters);
      // fetchOrdersList({
      //   skip: pagination.pageIndex * pagination.pageSize,
      //   take: pagination.pageSize,
      //   ...filters,
      // });
      fetchOrders();
    }, 500);

    return () => clearTimeout(handler);
  }, [pagination.pageIndex, pagination.pageSize, columnFilters]);

  const handleCreateBooking = async (orderIds: number[]) => {
    const courierId = await confirmSelect(
      (courierList?.data || []).map((c) => ({
        label: c.name,
        value: c.id,
      })),
      {
        title: "Select Courier Service",
        label: "Courier Services",
      }
    );
    await createBooking({ orderIds, courierId });
  };

  const handleCancelBooking = async (orderIds: number[]) => {
    const { confirmed } = await confirm({title: 'Order Cancel', description: "Are you sure to cancel order(s) booking?"});
    if(confirmed) {
      await cancelBooking({ orderIds });
    }
  };

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
    enableKeyboardShortcuts: true,
    layoutMode: "semantic",
    muiTableContainerProps: {
      sx: {
        minHeight: `calc(100vh - 160px)`,
        height: "auto",
        width: "auto",
        maxWidth: `calc(100vw - ${open ? drawerWidth : 0}px)`,
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
    enableBatchRowSelection: true,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    enableRowActions: true,
    // renderRowActions: (props) => {
    //   return (
    //     <CustomIconButton
    //       Icon={LocalShippingIcon}
    //       onClick={() => handleCreateBooking([props.row.original.id])}
    //     />
    //   );
    // },
    renderRowActionMenuItems: ({ row, table }) => [
      <MRT_ActionMenuItem
        icon={<LocalShippingIcon />}
        disabled={row.original.status === OrderStatus.booked}
        key="book-order"
        label="Book Order"
        onClick={() => handleCreateBooking([row.original.id])}
        table={table}
      />,
      <MRT_ActionMenuItem
        icon={<DisabledByDefaultIcon />}
        disabled={row.original.status !== OrderStatus.booked}
        key="cancel-order-booking"
        label="Cancel Order Booking"
        onClick={() => handleCancelBooking([row.original.id])}
        table={table}
      />,
    ],
    renderTopToolbar: (props) => (
      <TopToolbar
        title=""
        onRefresh={fetchOrders}
        actions={[
          {
            label: "Create Order",
            onClick() {
              navigate("/orders/create");
            },
            Icon: AddIcon,
          },
          {
            label: "Book",
            loading: createBookingIsLoading,
            onClick() {
              const orderIds = props.table
                .getSelectedRowModel()
                .rows.map((row) => row.original.id);
              return handleCreateBooking(orderIds);
            },
            Icon: LocalShippingIcon,
            disabled: props.table.getSelectedRowModel().rows.length === 0,
          },
        ]}
        {...props}
      />
    ),
    renderBottomToolbar: (props) => <BottomToolbar {...props} />,
    renderDetailPanel: (props) => <OrderDetailPanel {...props} />,
  });

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MaterialReactTable table={table} />
      </LocalizationProvider>
    </>
  );
}
