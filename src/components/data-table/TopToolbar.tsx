import { Box, Grid } from "@mui/material";
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
import PrimaryButton, { type PrimaryButtonProps } from "../Button";

export default function TopToolbar({
  title,
  table,
  actions,
}: {
  title?: string;
  actions?: PrimaryButtonProps[];
  table: MRT_TableInstance<any>;
}) {
  return (
    <>
      <Grid container spacing={1} p={1} justifyContent={"space-between"}>
        <Grid size="grow">
          {title && <Text variant="body1" bold text={title} />}
          <MRT_ToggleGlobalFilterButton table={table} />
          <MRT_GlobalFilterTextField table={table} />
          <MRT_ToggleFiltersButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleDensePaddingButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
        </Grid>
        <Grid>
          {actions?.map((action) => (
            <PrimaryButton {...action} />
          ))}
        </Grid>
      </Grid>
      <MRT_ToolbarAlertBanner table={table} />
    </>
  );
}
