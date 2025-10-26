import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import { forwardRef, type PropsWithChildren } from "react";
import CustomIconButton from "@/components/IconButton";
import Text from "@/components/Text";
import PrimaryButton from "@/components/Button";
import { Box } from "@mui/material";

// transition on close not working due to model binding with url need to do r&d but at last
const TransitionUp = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return (
    <Slide mountOnEnter unmountOnExit direction="up" ref={ref} {...props} />
  );
});

export default function OrderDialog({
  children,
  onSaveAsConfirm,
  onSaveAsDraft,
  loading,
  handleClose,
}: PropsWithChildren<{
  loading: boolean;
  onSaveAsDraft: () => void;
  onSaveAsConfirm: () => void;
  handleClose: () => void;
}>) {
  return (
    <Dialog
      fullScreen
      open={location.pathname === "/orders/create"}
      onClose={handleClose}
      slots={{
        transition: TransitionUp,
      }}
      slotProps={{
        paper: {
          sx: {
            position: "absolute",
            top: "3%",
            bottom: 0,
            margin: 0,
            height: "97%",
          },
        },
      }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar variant="dense">
          <CustomIconButton
            onClick={handleClose}
            color="inherit"
            Icon={CloseIcon}
            tooltip="Close create order"
          />
          <Text ml={2} flex={1} text="Create Order" />
          <Box
            sx={{ width: 350, gap: 1, flexDirection: "row", display: "flex" }}
          >
            <PrimaryButton
              disabled={loading}
              variant="text"
              onClick={onSaveAsDraft}
              label="Save as draft"
              color="inherit"
            />
            <PrimaryButton
              disabled={loading}
              variant="contained"
              onClick={onSaveAsConfirm}
              label="Save & Confirm"
              color="success"
            />
          </Box>
        </Toolbar>
      </AppBar>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
