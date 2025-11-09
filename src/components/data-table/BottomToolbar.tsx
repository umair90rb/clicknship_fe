import { Box } from "@mui/material";
import {
  MRT_TablePagination,
  type MRT_TableInstance,
} from "material-react-table";
import Text from "../Text";

export default function BottomToolbar({
  table,
}: {
  table: MRT_TableInstance<any>;
}) {
  return (
    <>
      <Box
        sx={{
          padding: 0,
          display: "flex",
          // justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text ml={1} color="textSecondary" text="Total Rows" />
        <Text ml={1} text={table.getRowCount() || 0} />
        <MRT_TablePagination table={table} />
      </Box>
      {/* <MRT_ToolbarAlertBanner table={table} /> */}
    </>
  );
}
