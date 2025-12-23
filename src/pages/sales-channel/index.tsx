import {
  MaterialReactTable,
  type MRT_ColumnFiltersState,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
// import { buildFilters } from "../orders/utils";
import TopToolbar from "@/components/data-table/TopToolbar";
import BottomToolbar from "@/components/data-table/BottomToolbar";
import type { Product } from "@/types/products";
import useDrawer from "@/hooks/useDrawer";
// import CustomIconButton from "@/components/IconButton";
import useCategoryBrandUnitList from "@/hooks/useCategoryBrandUnitList";
import type { MuiTableDropdownOption } from "@/types/common";
import CreateUpdateSalesChannelModal from "./CreateUpdateSalesChannelModal";
import { useListSalesChannelQuery } from "@/api/channel";

export default function SalesChannel() {
  const { drawerWidth, open } = useDrawer();

  const { brandList } = useCategoryBrandUnitList();

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
        id: "type",
        accessorKey: "type",
        header: "Type",
        enableColumnFilter: false,
      },
      {
        id: "source",
        accessorKey: "source",
        header: "Source",
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

  const [
    openCreateUpdateSalesChannelModal,
    setOpenCreateUpdateSalesChannelModal,
  ] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );

  //   const filters = buildFilters(columnFilters);

  const { data, isFetching } = useListSalesChannelQuery({});

  const table = useMaterialReactTable({
    // enableClickToCopy: true,
    // muiCopyButtonProps: {
    //   startIcon: <ContentCopyIcon />,
    // },
    enableFilterMatchHighlighting: false,
    enableFacetedValues: true,
    enableColumnFilters: true,
    paginationDisplayMode: "pages",
    // enableSelectAll: true,
    enableStickyHeader: true,
    // enableRowSelection: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    // enableRowActions: true,
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
    data: data || [],
    manualFiltering: true,
    manualPagination: true,
    autoResetPageIndex: false,
    // rowCount: data?.meta?.total || 0,
    state: { isLoading: isFetching, columnFilters, pagination },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    renderTopToolbar: (props) => (
      <TopToolbar
        {...props}
        actions={[
          {
            label: "Add Sale Channel",
            onClick() {
              setOpenCreateUpdateSalesChannelModal(true);
            },
            Icon: AddIcon,
          },
        ]}
      />
    ),
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
      <CreateUpdateSalesChannelModal
        open={openCreateUpdateSalesChannelModal}
        setOpen={setOpenCreateUpdateSalesChannelModal}
      />
    </>
  );
}
