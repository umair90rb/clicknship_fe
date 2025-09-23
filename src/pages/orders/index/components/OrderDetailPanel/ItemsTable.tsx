import CustomTable from "@/components/CustomTable";
import type { Item } from "@/types/orders/detail";

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
  return <CustomTable columns={columns} rows={items} />;
}
