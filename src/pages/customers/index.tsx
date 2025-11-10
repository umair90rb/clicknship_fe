import { useListProductQuery } from "@/api/products";
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
import type { Product } from "@/types/products";
import useDrawer from "@/hooks/useDrawer";
import CustomIconButton from "@/components/IconButton";
import useCategoryBrandUnitList from "@/hooks/useCategoryBrandUnitList";
import type { MuiTableDropdownOption } from "@/types/common";
import { useListCustomerQuery } from "@/api/customer";

export default function Customers() {
  const { drawerWidth, open } = useDrawer();

  const { unitList, brandList, categoryList } = useCategoryBrandUnitList();

  const units = useMemo<string[]>(
    () => unitList?.map(({ name }) => name) || [],
    [unitList]
  );
  const categories = useMemo<MuiTableDropdownOption[]>(
    () =>
      categoryList?.map(({ id, name }) => ({ value: id, label: name })) || [],
    [categoryList]
  );
  const brands = useMemo<MuiTableDropdownOption[]>(
    () => brandList?.map(({ id, name }) => ({ value: id, label: name })) || [],
    [brandList]
  );

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Customer Id",
        enableColumnFilter: false,
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: "Phone",
        enableClickToCopy: true,
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
        enableClickToCopy: true,
      },
      {
        id: "orders",
        accessorKey: "_count.orders",
        header: "Order Count",
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

  const { data, isFetching } = useListCustomerQuery(
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
    renderTopToolbar: (props) => <TopToolbar hideFilterButton {...props} />,
    // renderRowActions: ({ table, row }) => [
    //   <CustomIconButton Icon={DeleteIcon} color="error" onClick={() => {}} />,
    //   <CustomIconButton
    //     Icon={EditIcon}
    //     onClick={() => table.setEditingRow(row)}
    //   />,
    // ],
    renderBottomToolbar: (props) => <BottomToolbar {...props} />,
  });

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MaterialReactTable table={table} />
      </LocalizationProvider>
    </>
  );
}
