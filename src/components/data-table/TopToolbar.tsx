import { Grid } from "@mui/material";
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
import CustomIconButton from "../IconButton";
import RefreshIcon from '@mui/icons-material/Refresh';

export interface ITopToolbarProps {
  title?: string;
  hideFilterButton?: boolean;
  hideGlobalFilterButton?: boolean;
  hideFullScreenButton?: boolean;
  onRefresh?: () => void;
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
  onRefresh
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
            <MRT_ToggleGlobalFilterButton color="inherit" table={table} />
          )}
          {onRefresh && <CustomIconButton color="inherit" tooltip="Refresh Data" Icon={RefreshIcon} onClick={onRefresh} />}
          {!hideFilterButton && <MRT_ToggleFiltersButton color="inherit" table={table} />}
          <MRT_ShowHideColumnsButton color="inherit" table={table} />
          <MRT_ToggleDensePaddingButton color="inherit" table={table} />
          {!hideFullScreenButton && (
            <MRT_ToggleFullScreenButton color="inherit" table={table} />
          )}
        </Grid>
      </Grid>
      <MRT_ToolbarAlertBanner table={table} />
    </>
  );
}
