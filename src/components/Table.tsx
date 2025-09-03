import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box } from "@mui/material";

//example data type
type Person = {
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  city: string;
  state: string;
};

//nested data is ok, see accessorKeys in ColumnDef below
const data: Person[] = [
  {
    name: {
      firstName: "John",
      lastName: "Doe",
    },
    address: "261 Erdman Ford",
    city: "East Daphne",
    state: "Kentucky",
  },
];

export default function Table() {
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "name.firstName", //access nested data with dot notation
        header: "First Name",
        size: 150,
      },
      {
        accessorKey: "name.lastName",
        header: "Last Name",
        size: 150,
      },
      {
        accessorKey: "address", //normal accessorKey
        header: "Address",
        size: 200,
      },
      {
        accessorKey: "city",
        header: "City",
        size: 150,
      },
      {
        accessorKey: "state",
        header: "State",
        size: 150,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    paginationDisplayMode: "pages",
    enableStickyHeader: true,
    initialState: { density: "compact" },
    muiPaginationProps: {
      shape: "rounded",
      variant: "outlined",
      rowsPerPageOptions: [1000, 2000],
    },
    muiTablePaperProps: {
      sx: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
      },
    },
    muiTableContainerProps: {
      sx: {
        flex: 1,
        maxHeight: "100%",
      },
    },
  });

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "black",
      }}
    >
      <MaterialReactTable table={table} />
    </Box>
  );
}
