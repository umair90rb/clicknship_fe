import CustomTable from "@/components/CustomTable";
import FormAutocomplete from "@/components/form/FormAutocomplete";
import type { Item } from "@/types/orders/detail";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";

const columns = [
  {
    label: "Product",
    width: 180,
    render: (row: Item) => `${row.name} (${row.sku})`,
  },
  { id: "discount", label: "Discount", width: 50, align: "right" },
  { id: "quantity", label: "Quantity", width: 50, align: "right" },
  { id: "unitPrice", label: "Price", width: 50, align: "right" },
  {
    label: "Total",
    width: 50,
    align: "right",
    render: (row: Item) => row.unitPrice * row.quantity,
  },
];

export default function ItemsTable({ items }: { items: Item[] }) {
  const { control } = useForm();
  return (
    <Box
      sx={{
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CustomTable columns={columns} rows={items} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "speace-between",
          border: "1px solid",
        }}
      >
        <FormAutocomplete
          placeholer="Select Item"
          name="item"
          options={[]}
          control={control}
        />
      </Box>
    </Box>
  );
}
