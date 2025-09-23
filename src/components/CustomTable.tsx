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
import type { TableCellProps } from "@mui/material";

export type Column<T> = {
  id?: keyof T | string;
  label: string;
  align?: TableCellProps["align"];
  width?: number;
  render?: (row: T) => React.ReactNode;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

type CustomTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  size?: "small" | "medium";
};

export default function CustomTable<T extends { id: string | number }>({
  columns,
  rows,
  size = "small",
}: CustomTableProps<T>) {
  return (
    <TableContainer
      component={Paper}
      sx={{ m: 0, borderRadius: 0, width: "100%" }}
    >
      <Table size={size}>
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
              <StyledTableCell
                key={col?.id?.toString() || index}
                align={col.align ?? "left"}
                sx={{ width: col.width }}
              >
                {col.label}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                No Data
              </TableCell>
            </TableRow>
          )}
          {rows.map((row, index) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell
                  key={col?.id?.toString() || index}
                  align={col.align ?? "left"}
                  sx={{ width: col.width }}
                >
                  {col.render
                    ? col.render(row)
                    : (row[col.id as keyof T] as any)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
