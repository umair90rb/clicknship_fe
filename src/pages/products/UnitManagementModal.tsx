import CustomDialog from "@/components/Dialog";
import { useState } from "react";

export default function UnitManagementModal({ open, setOpen }) {
  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title="Manage Units"
      actions={[{ onClick() {}, label: "Add Unit" }]}
      enableCloseButton
    >
      <p>UOM Management</p>
    </CustomDialog>
  );
}
