import { Box } from "@mui/material";
import {
  MRT_TablePagination,
  MRT_ToolbarAlertBanner,
  type MRT_TableInstance,
} from "material-react-table";

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
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MRT_TablePagination table={table} />
      </Box>
      <MRT_ToolbarAlertBanner table={table} />
    </>
  );
}
