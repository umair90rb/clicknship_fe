import { useLazyListProductQuery, useListProductQuery } from "@/api/products";
import {
  MaterialReactTable,
  type MRT_ColumnFiltersState,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useEffect, useMemo, useRef, useState } from "react";
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
import UnitManagementModal from "./UnitManagementModal";
import CreateUpdateProductModal from "./CreateUpdateProductModal";
import useCategoryBrandUnitList from "@/hooks/useCategoryBrandUnitList";
import type { MuiTableDropdownOption } from "@/types/common";

export default function Products() {
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
        header: "Product Id",
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
      },
      {
        id: "description",
        accessorKey: "description",
        header: "Description",
        enableColumnFilter: false,
      },
      {
        id: "sku",
        accessorKey: "sku",
        header: "SKU",
        enableClickToCopy: true,
      },
      {
        id: "barcode",
        accessorKey: "barcode",
        header: "Barcode",
      },
      {
        id: "unitPrice",
        accessorKey: "unitPrice",
        header: "Unit Price",
        filterVariant: "range",
      },
      {
        id: "costPrice",
        accessorKey: "costPrice",
        header: "Cost Price",
        filterVariant: "range",
      },
      {
        id: "incentive",
        accessorKey: "incentive",
        header: "Inventive (Rs)",
        filterVariant: "range",
      },
      {
        id: "weight",
        accessorKey: "weight",
        header: "Weight (g)",
        filterVariant: "range",
      },

      {
        id: "unit",
        accessorKey: "unit",
        header: "Unit",
        filterVariant: "select",
        filterSelectOptions: units,
      },
      {
        id: "category",
        accessorKey: "category.name",
        header: "Category",
        filterVariant: "select",
        filterSelectOptions: categories,
      },
      {
        id: "brand",
        accessorKey: "brand.name",
        header: "Brand",
        filterVariant: "select",
        filterSelectOptions: brands,
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
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);

  const filters = buildFilters(columnFilters);

  const { data, isFetching } = useListProductQuery(
    {
      skip: pagination.pageIndex * pagination.pageSize,
      take: pagination.pageSize,
      ...filters,
    },
    { refetchOnMountOrArgChange: true }
  );
  // const [fetchProductsList, { data, isFetching }] = useLazyListProductQuery();

  // const firstRender = useRef(true);

  // useEffect(() => {
  //   if (firstRender.current) {
  //     firstRender.current = false;
  //     fetchProductsList({
  //       skip: pagination.pageIndex * pagination.pageSize,
  //       take: pagination.pageSize,
  //       ...buildFilters(columnFilters),
  //     });
  //     return;
  //   }

  //   const handler = setTimeout(() => {
  //     const filters = buildFilters(columnFilters);
  //     fetchProductsList({
  //       skip: pagination.pageIndex * pagination.pageSize,
  //       take: pagination.pageSize,
  //       ...filters,
  //     });
  //   }, 500);

  //   return () => clearTimeout(handler);
  // }, [pagination.pageIndex, pagination.pageSize, columnFilters]);

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
            label: "Add Product",
            onClick() {
              setProductModalOpen(true);
            },
            Icon: AddIcon,
          },
          {
            label: "Manage Units",
            onClick() {
              setUnitModalOpen(true);
            },
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
      <UnitManagementModal open={unitModalOpen} setOpen={setUnitModalOpen} />
      <CreateUpdateProductModal
        open={productModalOpen}
        setOpen={setProductModalOpen}
      />
    </>
  );
}
