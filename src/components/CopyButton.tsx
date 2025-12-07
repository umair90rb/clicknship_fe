import { Grid } from "@mui/material";
import CustomIconButton from "./IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import type { PropsWithChildren } from "react";

export default function CopyButton({
  children,
  copyText = "",
}: PropsWithChildren<{ copyText?: string }>) {
  return (
    <Grid container alignItems={"center"}>
      {children}
      <CustomIconButton
        size="small"
        Icon={ContentCopyIcon}
        onClick={() => navigator.clipboard.writeText(copyText)}
      />
    </Grid>
  );
}
