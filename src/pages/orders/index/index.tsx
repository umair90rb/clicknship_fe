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
import Text from "@/components/Text";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { data, type Employee } from "@/data/make-data";

export default function Orders() {
  const columns = useMemo<MRT_ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: "firstName", //access nested data with dot notation
        header: "First Name",
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
      },
      {
        accessorKey: "email", //normal accessorKey
        header: "Email Address",
      },
      {
        accessorKey: "jobTitle",
        header: "Job Title",
      },
      {
        accessorKey: "salary",
        header: "Salary",
      },
      {
        accessorKey: "signatureCatchPhrase",
        header: "Signature",
      },
      {
        accessorKey: "startDate",
        header: "Start Data",
      },
      {
        accessorKey: "avatar",
        header: "Avatar",
      },
    ],
    []
  );

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );

  useEffect(() => {
    //fetch data
    console.log(columnFilters);
  }, [columnFilters]);

  const table = useMaterialReactTable({
    columns,
    data,
    manualFiltering: true,
    // enableClickToCopy: true,
    // muiCopyButtonProps: {
    //   startIcon: <ContentCopyIcon />,
    // },
    // enableEditing: true,
    // editDisplayMode: "cell",
    // enableSelectAll: false,
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters },
    paginationDisplayMode: "pages",
    enableStickyHeader: true,
    enableRowSelection: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableRowActions: true,
    enableKeyboardShortcuts: true,
    layoutMode: "semantic",
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
    enableExpandAll: true,
    // muiExpandButtonProps: ({ row, table }) => ({
    //   onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
    // }),
    renderDetailPanel: () => (
      <>
        <br></br>
        <br></br>
        <br></br>
      </>
    ),
    initialState: {
      density: "compact",
      showColumnFilters: true,
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: "none",
        height: "auto",
      },
    },
  });

  return <MaterialReactTable table={table} />;
}
