import PrimaryButton from "@/components/Button";
import CustomTable from "@/components/CustomTable";
import FormAutocomplete from "@/components/form/FormAutocomplete";
import { FormInputText } from "@/components/form/FormInput";
import CustomIconButton from "@/components/IconButton";
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
        minHeight: 250,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CustomTable columns={columns} rows={items} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box sx={{ flexBasis: "300%" }}>
          <FormAutocomplete
            placeholer="Select Item"
            name="item"
            options={["item 1", "item 2"]}
            control={control}
          />
        </Box>
        <FormInputText
          name="quantity"
          type="number"
          control={control}
          placeholer="Quantity"
        />
        <FormInputText
          name="discount"
          type="number"
          control={control}
          placeholer="Discount"
        />
        <FormInputText
          name="price"
          type="number"
          control={control}
          placeholer="Price"
        />
        <FormInputText
          name="total"
          type="number"
          control={control}
          placeholer="Total"
        />
        <CustomIconButton icon="add_circle" size="large" onClick={() => {}} />
      </Box>
    </Box>
  );
}
