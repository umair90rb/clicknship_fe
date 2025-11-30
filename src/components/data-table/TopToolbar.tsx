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

export interface ITopToolbarProps {
  title?: string;
  hideFilterButton?: boolean;
  hideGlobalFilterButton?: boolean;
  hideFullScreenButton?: boolean;
  actions?: PrimaryButtonProps[];
  table: MRT_TableInstance<any>;
}

export default function TopToolbar({
  title,
  table,
  actions,
  hideFilterButton = false,
  hideGlobalFilterButton = false,
  hideFullScreenButton = false,
}: ITopToolbarProps) {
  return (
    <>
      <Grid container spacing={1} p={1} justifyContent={"space-between"}>
        <Grid alignContent={"center"}>
          {title && <Text variant="body1" bold text={title} />}
        </Grid>
        <Grid size="grow">
          <Grid container spacing={1}>
            {actions?.map((action) => (
              <Grid>
                <PrimaryButton {...action} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid alignContent={"center"}>
          <MRT_GlobalFilterTextField table={table} />
        </Grid>
        <Grid>
          {!hideGlobalFilterButton && (
            <MRT_ToggleGlobalFilterButton table={table} />
          )}
          {!hideFilterButton && <MRT_ToggleFiltersButton table={table} />}
          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleDensePaddingButton table={table} />
          {!hideFullScreenButton && (
            <MRT_ToggleFullScreenButton table={table} />
          )}
        </Grid>
      </Grid>
      <MRT_ToolbarAlertBanner table={table} />
    </>
  );
}
