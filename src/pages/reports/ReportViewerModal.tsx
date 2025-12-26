import CustomDialog from "@/components/Dialog";
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import FormDateRangePicker, {
  getDefaultDateRange,
  formatDateRangeForApi,
} from "@/components/form/FormDateRangePicker";
import { useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import DateRangePicker from "@/components/DateRangePicker";

export interface ReportColumn<T = Record<string, unknown>> {
  id: keyof T | string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  format?: "number" | "currency" | "percent" | "date";
}

interface DateRange {
  start: Dayjs | null;
  end: Dayjs | null;
}

interface ReportViewerModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ReportColumn<any>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[] | undefined;
  isLoading: boolean;
  showDateFilter?: boolean;
  onDateRangeChange?: (range: { start?: string; end?: string }) => void;
  onRefresh?: () => void;
  meta?: {
    total: number;
    generatedAt: string;
  };
}

function formatValue(
  row: Record<string, unknown>,
  column: ReportColumn
): React.ReactNode {
  if (column.accessor) {
    return column.accessor(row);
  }

  const value = row[column.id as string];

  if (value === null || value === undefined) {
    return "-";
  }

  switch (column.format) {
    case "currency":
      return `Rs ${Number(value).toLocaleString("en-PK", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    case "number":
      return Number(value).toLocaleString();
    case "percent":
      return `${Number(value).toFixed(1)}%`;
    case "date":
      return dayjs(value as string).format("MMM D, YYYY");
    default:
      return String(value);
  }
}

export default function ReportViewerModal({
  open,
  setOpen,
  title,
  columns,
  data,
  isLoading,
  showDateFilter = true,
  onDateRangeChange,
  onRefresh,
  meta,
}: ReportViewerModalProps) {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (onDateRangeChange) {
      onDateRangeChange(formatDateRangeForApi(range));
    }
  };

  const handleExportCsv = () => {
    if (!data || data.length === 0) return;

    const headers = columns.map((col) => col.header).join(",");
    const rows = data
      .map((row) =>
        columns
          .map((col) => {
            const value = formatValue(row, col);
            const stringValue = String(value).replace(/,/g, ";");
            return `"${stringValue}"`;
          })
          .join(",")
      )
      .join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}_${dayjs().format(
      "YYYY-MM-DD"
    )}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title={title}
      size="lg"
      fullScreen
      hideCancelButton
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Filters & Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {showDateFilter && (
              <FormDateRangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
              />
            )}
          </Box> */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {showDateFilter && (
              <DateRangePicker                                             
                value={dateRange}                                          
                onChange={handleDateRangeChange}                                    
                maxDate={dayjs()}      
              />    
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {onRefresh && (
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
                disabled={isLoading}
              >
                Refresh
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportCsv}
              disabled={!data || data.length === 0}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        {/* Meta info */}
        {meta && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {meta.total} records | Generated at{" "}
              {dayjs(meta.generatedAt).format("MMM D, YYYY h:mm A")}
            </Typography>
          </Box>
        )}

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{ flexGrow: 1, maxHeight: "calc(100vh - 280px)" }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
              }}
            >
              <CircularProgress />
            </Box>
          ) : !data || data.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
              }}
            >
              <Typography color="text.secondary">No data available</Typography>
            </Box>
          ) : (
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.id)}
                      align={column.align || "left"}
                      sx={{ fontWeight: 600 }}
                    >
                      {column.header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index} hover>
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.id)}
                        align={column.align || "left"}
                      >
                        {formatValue(row, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Box>
    </CustomDialog>
  );
}
