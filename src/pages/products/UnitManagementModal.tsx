import CustomDialog from "@/components/Dialog";
import type { ModalProps } from "@/types/common";

type UnitManagementModalProps = ModalProps;

export default function UnitManagementModal({
  open,
  setOpen,
}: UnitManagementModalProps) {
  return (
    <CustomDialog open={open} setOpen={setOpen} title="Manage Units" size="md">
      <p>UOM Management</p>
    </CustomDialog>
  );
}
