import type { Item } from "@/types/orders/detail";
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

export default function ItemsTable({ items }: { items: Item[] }) {
  return (
    <TableContainer
      component={Paper}
      sx={{ m: 0, borderRadius: 0, width: "100%" }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>Product</StyledTableCell>
            <StyledTableCell align="right">Discount</StyledTableCell>
            <StyledTableCell align="right">Quantity</StyledTableCell>
            <StyledTableCell align="right">Price</StyledTableCell>
            <StyledTableCell align="right">Total</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.map((item) => (
            <TableRow key={item.id}>
              <TableCell width={180}>
                {item.name} ({item.sku})
              </TableCell>
              <TableCell width={50} align="right">
                {item.discount}
              </TableCell>
              <TableCell width={50} align="right">
                {item.quantity}
              </TableCell>
              <TableCell width={50} align="right">
                {item.unitPrice?.toFixed(2)}
              </TableCell>
              <TableCell width={50} align="right">
                {(item.quantity * item.unitPrice)?.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
