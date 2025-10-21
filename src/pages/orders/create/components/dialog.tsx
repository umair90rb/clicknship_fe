import { useLocation, useNavigate } from "react-router";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import { forwardRef, type PropsWithChildren } from "react";

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

export default function OrderDialog({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

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
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Create Order
          </Typography>
          <Button autoFocus color="inherit" onClick={() => {}}>
            save
          </Button>
          <Button autoFocus color="inherit" onClick={() => {}}>
            cancel
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
