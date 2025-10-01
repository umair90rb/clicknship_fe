import CustomTable from "@/components/CustomTable";
import { FormInputText } from "@/components/form/FormInput";
import CustomIconButton from "@/components/IconButton";
import type { Payment } from "@/types/orders/detail";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import AddBoxIcon from "@mui/icons-material/AddBox";

const columns = [
  { id: "tId", label: "Tid#" },
  { id: "bank", label: "Bank" },
  { id: "amount", label: "Amount" },
  { id: "type", label: "Type" },
  { id: "note", label: "Note" },
];

export default function PaymentsTable({ payments }: { payments: Payment[] }) {
  const { control } = useForm();
  return (
    <Box
      sx={{
        minHeight: 250,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CustomTable columns={columns} rows={payments} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
        <FormInputText name="tid" control={control} placeholer="Tid" />
        <FormInputText name="bank" control={control} placeholer="Bank" />
        <FormInputText
          name="amount"
          type="number"
          control={control}
          placeholer="Amount"
        />
        <FormInputText name="type" control={control} placeholer="Type" />
        <Box sx={{ flexBasis: "300%" }}>
          <FormInputText name="note" control={control} placeholer="Note" />
        </Box>
        <CustomIconButton Icon={AddBoxIcon} size="large" onClick={() => {}} />
      </Box>
    </Box>
  );
}
