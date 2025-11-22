import { useGetCityQuery, useListCitiesQuery } from "@/api/city";
import useDrawer from "@/hooks/useDrawer";
import {
  MaterialReactTable,
  type MRT_ColumnFiltersState,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableInstance,
  type MRT_Row,
} from "material-react-table";
import { useMemo, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AddIcon from "@mui/icons-material/Add";
import { buildFilters } from "../orders/utils";
import TopToolbar from "@/components/data-table/TopToolbar";
import BottomToolbar from "@/components/data-table/BottomToolbar";
import type { City } from "@/types/city";
import { Grid } from "@mui/material";
import Text from "@/components/Text";

function CityDetailPanel({
  row,
}: {
  row: MRT_Row<any>;
  table: MRT_TableInstance<any>;
}) {
  const cityId: number = row.getValue("id");
  const { data, isLoading } = useGetCityQuery(cityId);

  if (isLoading) return <p>Loading...</p>;

  return (
    <Grid container spacing={1}>
      {data?.courierMappedCities?.map((courierMappedCity) => (
        <Grid border={"0.1px solid grey"} padding={1}>
          <Text variant="body1">Courier: {courierMappedCity.courier}</Text>
          <Text variant="body1">City: {courierMappedCity.mapped}</Text>
          {courierMappedCity?.code && (
            <Text variant="body1">City Code: {courierMappedCity?.code}</Text>
          )}
          {courierMappedCity?.courierAssignedId && (
            <Text variant="body1">
              Courier Assigned Id: {courierMappedCity?.courierAssignedId}
            </Text>
          )}
        </Grid>
      ))}
    </Grid>
  );
}

export default function CitiesManagement() {
  const { drawerWidth, open } = useDrawer();

  const columns = useMemo<MRT_ColumnDef<City>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Id",
        maxSize: 1,
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        id: "city",
        accessorKey: "city",
        header: "City",
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

  const { data, isFetching } = useListCitiesQuery(
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
    enableRowSelection: false,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableRowActions: false,
    enableKeyboardShortcuts: true,
    enableExpandAll: false,
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
        title="Cities"
        actions={[
          {
            label: "Add Missing Courier City",
            onClick() {},
            Icon: AddIcon,
          },
        ]}
      />
    ),
    renderBottomToolbar: (props) => <BottomToolbar {...props} />,
    renderDetailPanel: (props) => <CityDetailPanel {...props} />,
  });
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MaterialReactTable table={table} />
      </LocalizationProvider>
    </>
  );
}
