import { Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export interface DateRange {
  start: Dayjs | null;
  end: Dayjs | null;
}

interface FormDateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  startLabel?: string;
  endLabel?: string;
}

export default function FormDateRangePicker({
  value,
  onChange,
  startLabel = "Start Date",
  endLabel = "End Date",
}: FormDateRangePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <DatePicker
          label={startLabel}
          value={value.start}
          onChange={(newValue) => onChange({ ...value, start: newValue as Dayjs | null })}
          slotProps={{
            textField: { size: "small", fullWidth: true },
          }}
        />
        <DatePicker
          label={endLabel}
          value={value.end}
          onChange={(newValue) => onChange({ ...value, end: newValue as Dayjs | null })}
          minDate={value.start || undefined}
          slotProps={{
            textField: { size: "small", fullWidth: true },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}

export function getDefaultDateRange(): DateRange {
  return {
    start: dayjs().subtract(30, "day"),
    end: dayjs(),
  };
}

export function formatDateRangeForApi(range: DateRange) {
  return {
    start: range.start?.format("YYYY-MM-DD"),
    end: range.end?.format("YYYY-MM-DD"),
  };
}
