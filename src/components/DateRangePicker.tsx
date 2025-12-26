import { useState, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Divider,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import dayjs, { type Dayjs } from "dayjs";

// Preset options
export interface DatePreset {
  label: string;
  getValue: () => { start: Dayjs; end: Dayjs };
}

const defaultPresets: DatePreset[] = [
  {
    label: "Today",
    getValue: () => ({ start: dayjs().startOf("day"), end: dayjs().endOf("day") }),
  },
  {
    label: "Yesterday",
    getValue: () => ({
      start: dayjs().subtract(1, "day").startOf("day"),
      end: dayjs().subtract(1, "day").endOf("day"),
    }),
  },
  {
    label: "Last 7 days",
    getValue: () => ({
      start: dayjs().subtract(6, "day").startOf("day"),
      end: dayjs().endOf("day"),
    }),
  },
  {
    label: "Last 30 days",
    getValue: () => ({
      start: dayjs().subtract(29, "day").startOf("day"),
      end: dayjs().endOf("day"),
    }),
  },
  {
    label: "Last 90 days",
    getValue: () => ({
      start: dayjs().subtract(89, "day").startOf("day"),
      end: dayjs().endOf("day"),
    }),
  },
  {
    label: "Last 12 months",
    getValue: () => ({
      start: dayjs().subtract(12, "month").startOf("day"),
      end: dayjs().endOf("day"),
    }),
  },
  {
    label: "This month",
    getValue: () => ({
      start: dayjs().startOf("month"),
      end: dayjs().endOf("month"),
    }),
  },
  {
    label: "Last month",
    getValue: () => ({
      start: dayjs().subtract(1, "month").startOf("month"),
      end: dayjs().subtract(1, "month").endOf("month"),
    }),
  },
  {
    label: "This year",
    getValue: () => ({
      start: dayjs().startOf("year"),
      end: dayjs().endOf("year"),
    }),
  },
];

export interface DateRange {
  start: Dayjs | null;
  end: Dayjs | null;
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  presets?: DatePreset[];
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disabled?: boolean;
  placeholder?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface CalendarMonthProps {
  month: Dayjs;
  tempValue: DateRange;
  onDateClick: (date: Dayjs) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  onMonthChange: (direction: "prev" | "next") => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

function CalendarMonth({
  month,
  tempValue,
  onDateClick,
  minDate,
  maxDate,
  onMonthChange,
  canGoPrev,
  canGoNext,
}: CalendarMonthProps) {
  const daysInMonth = month.daysInMonth();
  const firstDayOfMonth = month.startOf("month").day();
  const prevMonth = month.subtract(1, "month");
  const prevMonthDays = prevMonth.daysInMonth();

  const isInRange = useCallback(
    (date: Dayjs) => {
      if (!tempValue.start || !tempValue.end) return false;
      return date.isAfter(tempValue.start, "day") && date.isBefore(tempValue.end, "day");
    },
    [tempValue]
  );

  const isStartDate = useCallback(
    (date: Dayjs) => tempValue.start?.isSame(date, "day") || false,
    [tempValue.start]
  );

  const isEndDate = useCallback(
    (date: Dayjs) => tempValue.end?.isSame(date, "day") || false,
    [tempValue.end]
  );

  const isDisabled = useCallback(
    (date: Dayjs) => {
      if (minDate && date.isBefore(minDate, "day")) return true;
      if (maxDate && date.isAfter(maxDate, "day")) return true;
      return false;
    },
    [minDate, maxDate]
  );

  const days: { date: Dayjs; isCurrentMonth: boolean }[] = [];

  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      date: prevMonth.date(prevMonthDays - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: month.date(i),
      isCurrentMonth: true,
    });
  }

  // Next month days to fill the grid (6 rows * 7 = 42 cells)
  const remainingDays = 42 - days.length;
  const nextMonth = month.add(1, "month");
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: nextMonth.date(i),
      isCurrentMonth: false,
    });
  }

  return (
    <Box sx={{ width: 280 }}>
      {/* Month Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
          px: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={() => onMonthChange("prev")}
          disabled={!canGoPrev}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle2" fontWeight={600}>
          {month.format("MMMM YYYY")}
        </Typography>
        <IconButton
          size="small"
          onClick={() => onMonthChange("next")}
          disabled={!canGoNext}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Weekday Headers */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0,
          mb: 0.5,
        }}
      >
        {WEEKDAYS.map((day) => (
          <Box
            key={day}
            sx={{
              textAlign: "center",
              py: 0.5,
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "text.secondary",
            }}
          >
            {day}
          </Box>
        ))}
      </Box>

      {/* Days Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0,
        }}
      >
        {days.map(({ date, isCurrentMonth }, index) => {
          const inRange = isInRange(date);
          const isStart = isStartDate(date);
          const isEnd = isEndDate(date);
          const disabled = isDisabled(date);

          return (
            <Box
              key={index}
              onClick={() => isCurrentMonth && !disabled && onDateClick(date)}
              sx={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.875rem",
                cursor: !isCurrentMonth || disabled ? "default" : "pointer",
                color: !isCurrentMonth
                  ? "text.disabled"
                  : disabled
                  ? "text.disabled"
                  : isStart || isEnd
                  ? "primary.contrastText"
                  : inRange
                  ? "primary.dark"
                  : "text.primary",
                bgcolor:
                  isStart || isEnd
                    ? "primary.main"
                    : inRange && isCurrentMonth
                    ? "primary.light"
                    : "transparent",
                borderRadius:
                  isStart && isEnd
                    ? "50%"
                    : isStart
                    ? "50% 0 0 50%"
                    : isEnd
                    ? "0 50% 50% 0"
                    : 0,
                "&:hover": {
                  bgcolor:
                    !isCurrentMonth || disabled
                      ? "transparent"
                      : isStart || isEnd
                      ? "primary.dark"
                      : "action.hover",
                },
                mx: "auto",
              }}
            >
              {date.date()}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default function DateRangePicker({
  value,
  onChange,
  presets = defaultPresets,
  minDate,
  maxDate = dayjs(),
  disabled = false,
  placeholder = "Select date range",
}: DateRangePickerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tempValue, setTempValue] = useState<DateRange>(value);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [leftMonth, setLeftMonth] = useState<Dayjs>(
    value.start || dayjs().subtract(1, "month")
  );
  const [rightMonth, setRightMonth] = useState<Dayjs>(value.end || dayjs());
  const [startInputValue, setStartInputValue] = useState(
    value.start?.format("YYYY-MM-DD") || ""
  );
  const [endInputValue, setEndInputValue] = useState(
    value.end?.format("YYYY-MM-DD") || ""
  );

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setTempValue(value);
    setSelectedPreset(null);
    setStartInputValue(value.start?.format("YYYY-MM-DD") || "");
    setEndInputValue(value.end?.format("YYYY-MM-DD") || "");
    if (value.start) {
      setLeftMonth(value.start.startOf("month"));
    } else {
      setLeftMonth(dayjs().subtract(1, "month").startOf("month"));
    }
    if (value.end) {
      setRightMonth(
        value.end.isSame(value.start, "month")
          ? value.end.add(1, "month").startOf("month")
          : value.end.startOf("month")
      );
    } else {
      setRightMonth(dayjs().startOf("month"));
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancel = () => {
    setTempValue(value);
    handleClose();
  };

  const handleApply = () => {
    onChange(tempValue);
    handleClose();
  };

  const handlePresetClick = (preset: DatePreset) => {
    const { start, end } = preset.getValue();
    setTempValue({ start, end });
    setSelectedPreset(preset.label);
    setStartInputValue(start.format("YYYY-MM-DD"));
    setEndInputValue(end.format("YYYY-MM-DD"));
    setLeftMonth(start.startOf("month"));
    setRightMonth(
      end.isSame(start, "month")
        ? end.add(1, "month").startOf("month")
        : end.startOf("month")
    );
  };

  const handleDateClick = useCallback(
    (date: Dayjs) => {
      if (!tempValue.start || (tempValue.start && tempValue.end)) {
        // Start new selection
        setTempValue({ start: date, end: null });
        setStartInputValue(date.format("YYYY-MM-DD"));
        setEndInputValue("");
        setSelectedPreset("Custom");
      } else {
        // Complete selection
        if (date.isBefore(tempValue.start)) {
          setTempValue({ start: date, end: tempValue.start });
          setStartInputValue(date.format("YYYY-MM-DD"));
          setEndInputValue(tempValue.start.format("YYYY-MM-DD"));
        } else {
          setTempValue({ start: tempValue.start, end: date });
          setEndInputValue(date.format("YYYY-MM-DD"));
        }
        setSelectedPreset("Custom");
      }
    },
    [tempValue]
  );

  const handleStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStartInputValue(val);
    const parsed = dayjs(val, "YYYY-MM-DD", true);
    if (parsed.isValid()) {
      const newStart = parsed;
      if (
        !tempValue.end ||
        newStart.isBefore(tempValue.end) ||
        newStart.isSame(tempValue.end)
      ) {
        setTempValue((prev) => ({ ...prev, start: newStart }));
        setLeftMonth(newStart.startOf("month"));
        setSelectedPreset("Custom");
      }
    }
  };

  const handleEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEndInputValue(val);
    const parsed = dayjs(val, "YYYY-MM-DD", true);
    if (parsed.isValid()) {
      const newEnd = parsed;
      if (
        !tempValue.start ||
        newEnd.isAfter(tempValue.start) ||
        newEnd.isSame(tempValue.start)
      ) {
        setTempValue((prev) => ({ ...prev, end: newEnd }));
        setRightMonth(newEnd.startOf("month"));
        setSelectedPreset("Custom");
      }
    }
  };

  const handleLeftMonthChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setLeftMonth((prev) => prev.subtract(1, "month"));
    } else {
      setLeftMonth((prev) => prev.add(1, "month"));
    }
  };

  const handleRightMonthChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setRightMonth((prev) => prev.subtract(1, "month"));
    } else {
      setRightMonth((prev) => prev.add(1, "month"));
    }
  };

  const displayValue = useMemo(() => {
    if (!value.start && !value.end) return placeholder;
    if (value.start && value.end) {
      if (value.start.isSame(value.end, "day")) {
        return value.start.format("MMM D, YYYY");
      }
      return `${value.start.format("MMM D, YYYY")} - ${value.end.format("MMM D, YYYY")}`;
    }
    if (value.start) return `${value.start.format("MMM D, YYYY")} - ...`;
    return placeholder;
  }, [value, placeholder]);

  const canLeftGoPrev = true;
  const canLeftGoNext = leftMonth.add(1, "month").isBefore(rightMonth, "month");
  const canRightGoPrev = rightMonth.subtract(1, "month").isAfter(leftMonth, "month");
  const canRightGoNext = true;

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpen}
        disabled={disabled}
        startIcon={<CalendarTodayIcon />}
        sx={{
          justifyContent: "flex-start",
          textTransform: "none",
          color: value.start ? "text.primary" : "text.secondary",
          borderColor: "divider",
          minWidth: 220,
          "&:hover": {
            borderColor: "text.primary",
          },
        }}
      >
        {displayValue}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCancel}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: 3,
              maxWidth: isMobile ? "100vw" : "auto",
              maxHeight: "90vh",
              overflow: "auto",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            minHeight: 400,
          }}
        >
          {/* Presets List */}
          <Box
            sx={{
              width: isMobile ? "100%" : 180,
              borderRight: isMobile ? "none" : 1,
              borderBottom: isMobile ? 1 : "none",
              borderColor: "divider",
              py: 1,
            }}
          >
            <List dense disablePadding>
              {presets.map((preset) => (
                <ListItemButton
                  key={preset.label}
                  selected={selectedPreset === preset.label}
                  onClick={() => handlePresetClick(preset)}
                  sx={{
                    py: 0.75,
                    "&.Mui-selected": {
                      bgcolor: "primary.light",
                      "&:hover": {
                        bgcolor: "primary.light",
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={preset.label}
                    slotProps={{ primary: { variant: "body2" } }}
                  />
                </ListItemButton>
              ))}
              <ListItemButton
                selected={selectedPreset === "Custom"}
                onClick={() => setSelectedPreset("Custom")}
                sx={{
                  py: 0.75,
                  "&.Mui-selected": {
                    bgcolor: "primary.light",
                    "&:hover": {
                      bgcolor: "primary.light",
                    },
                  },
                }}
              >
                <ListItemText
                  primary="Custom"
                  slotProps={{ primary: { variant: "body2" } }}
                />
              </ListItemButton>
            </List>
          </Box>

          {/* Calendar Section */}
          <Box sx={{ flex: 1, p: 2 }}>
            {/* Date Inputs */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                label="Since"
                size="small"
                value={startInputValue}
                onChange={handleStartInputChange}
                placeholder="YYYY-MM-DD"
                sx={{ flex: 1 }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
              <TextField
                label="Until"
                size="small"
                value={endInputValue}
                onChange={handleEndInputChange}
                placeholder="YYYY-MM-DD"
                sx={{ flex: 1 }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>

            {/* Calendars */}
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 3,
              }}
            >
              {/* Left Calendar */}
              <CalendarMonth
                month={leftMonth}
                tempValue={tempValue}
                onDateClick={handleDateClick}
                minDate={minDate}
                maxDate={maxDate}
                onMonthChange={handleLeftMonthChange}
                canGoPrev={canLeftGoPrev}
                canGoNext={canLeftGoNext}
              />

              {/* Right Calendar */}
              {!isMobile && (
                <CalendarMonth
                  month={rightMonth}
                  tempValue={tempValue}
                  onDateClick={handleDateClick}
                  minDate={minDate}
                  maxDate={maxDate}
                  onMonthChange={handleRightMonthChange}
                  canGoPrev={canRightGoPrev}
                  canGoNext={canRightGoNext}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            p: 2,
          }}
        >
          <Button variant="text" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleApply}
            disabled={!tempValue.start || !tempValue.end}
          >
            Apply
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// Helper function to format date range for API
export function formatDateRangeForApi(range: DateRange) {
  return {
    start: range.start?.format("YYYY-MM-DD"),
    end: range.end?.format("YYYY-MM-DD"),
  };
}

// Helper to get default range (last 30 days)
export function getDefaultDateRange(): DateRange {
  return {
    start: dayjs().subtract(29, "day").startOf("day"),
    end: dayjs().endOf("day"),
  };
}
