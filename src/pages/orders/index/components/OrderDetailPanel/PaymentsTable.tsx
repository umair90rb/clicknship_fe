import CustomTable from "@/components/CustomTable";
import type { Item, Payment } from "@/types/orders/detail";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  tableCellClasses,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const columns = [
  { id: "tId", label: "Tid#" },
  { id: "bank", label: "Bank" },
  { id: "amount", label: "Amount" },
  { id: "type", label: "Type" },
  { id: "note", label: "Note" },
];

export default function PaymentsTable({ payments }: { payments: Payment[] }) {
  return <CustomTable columns={columns} rows={payments} />;
}
