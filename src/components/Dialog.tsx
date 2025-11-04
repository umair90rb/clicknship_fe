import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, type PropsWithChildren } from "react";
import PrimaryButton, { type PrimaryButtonProps } from "./Button";
import Text from "./Text";
import { Box, Grid, type Breakpoint } from "@mui/material";
import CustomIconButton from "./IconButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";

interface CustomDialogProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  actions?: PrimaryButtonProps[];
  title?: string;
  description?: string;
  size?: Breakpoint;
  fullScreen?: boolean;
}

export default function CustomDialog({
  children,
  open,
  setOpen,
  actions,
  title,
  description,
  size = "sm",
  fullScreen = false,
}: PropsWithChildren<CustomDialogProps>) {
  const [toggleFullScreen, setToggleFullScreen] = useState(fullScreen);
  const handleToggleFullScreen = () => setToggleFullScreen(!toggleFullScreen);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      fullScreen={toggleFullScreen}
      onClose={handleClose}
      scroll={"paper"}
      aria-labelledby={`${title}-title`}
      aria-describedby={`${title}-description`}
      fullWidth
      maxWidth={size}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="body1">{title}</Text>
        <Box>
          <CustomIconButton
            size="small"
            Icon={
              toggleFullScreen
                ? FullscreenExitOutlinedIcon
                : FullscreenOutlinedIcon
            }
            aria-label="toggle-full-screen"
            onClick={handleToggleFullScreen}
          />
          <CustomIconButton
            size="small"
            Icon={CloseOutlinedIcon}
            aria-label="toggle-full-screen"
            onClick={handleClose}
          />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {description && <DialogContentText>{description}</DialogContentText>}
        {children}
      </DialogContent>
      <DialogActions>
        <PrimaryButton onClick={handleClose} label="Cancel" color="inherit" />
        {(actions || []).map((action) => (
          <PrimaryButton {...action} />
        ))}
      </DialogActions>
    </Dialog>
  );
}
