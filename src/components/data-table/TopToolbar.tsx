import { Box } from "@mui/material";
import {
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MRT_ToolbarAlertBanner,
  type MRT_TableInstance,
} from "material-react-table";
import Text from "../Text";

export default function TopToolbar({
  title,
  table,
}: {
  title: string | null;
  table: MRT_TableInstance<any>;
}) {
  return (
    <>
      <Box
        sx={{
          padding: 1,
          gap: "1px",
          display: "flex",
          // justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title && <Text variant="body1" bold text={title} />}
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_GlobalFilterTextField table={table} />
      </Box>
      <MRT_ToolbarAlertBanner table={table} />
    </>
  );
}
