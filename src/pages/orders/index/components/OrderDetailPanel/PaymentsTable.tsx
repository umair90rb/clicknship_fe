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

export default function PaymentsTable({ payments }: { payments: Payment[] }) {
  return (
    <TableContainer
      component={Paper}
      sx={{ m: 0, borderRadius: 0, width: "100%" }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>Tid#</StyledTableCell>
            <StyledTableCell>Bank</StyledTableCell>
            <StyledTableCell>Amount</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Note</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.length ? (
            payments?.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.tId}</TableCell>
                <TableCell>{payment.bank}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell>{payment.note}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No Data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
