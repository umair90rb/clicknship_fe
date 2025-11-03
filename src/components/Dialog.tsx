import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import type { PropsWithChildren } from "react";
import PrimaryButton, { type PrimaryButtonProps } from "./Button";

interface CustomDialogProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  actions?: PrimaryButtonProps[];
  title?: string;
  dividers?: boolean;
  enableCloseButton?: boolean;
}

export default function CustomDialog({
  children,
  open,
  setOpen,
  actions,
  title,
  dividers = true,
  enableCloseButton,
}: PropsWithChildren<CustomDialogProps>) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={"paper"}
      aria-labelledby={`${title}-title`}
      aria-describedby={`${title}-description`}
    >
      {title && <DialogTitle id={`${title}-title`}>{title}</DialogTitle>}
      <DialogContent dividers={dividers}>
        <DialogContentText id={`${title}-description`} tabIndex={-1}>
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {enableCloseButton && (
          <PrimaryButton onClick={handleClose} label="Cancel" color="inherit" />
        )}
        {(actions || []).map((action) => (
          <PrimaryButton {...action} />
        ))}
      </DialogActions>
    </Dialog>
  );
}
