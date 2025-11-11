import { InputLabel, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { Controller } from "react-hook-form";

interface FormToggleButtonsProps {
  label?: string | null;
  options:
    | {
        label: string;
        value: string | number;
        color:
          | "error"
          | "primary"
          | "standard"
          | "secondary"
          | "info"
          | "success"
          | "warning";
      }[]
    | string[];
  name: string;
  control: any;
}

export default function FormToggleButtons({
  name,
  control,
  options,
  label,
}: FormToggleButtonsProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          {label && <InputLabel>{label}</InputLabel>}
          <ToggleButtonGroup
            size="small"
            value={value}
            fullWidth
            exclusive
            onChange={onChange}
          >
            {options.map((option) =>
              typeof option === "string" ? (
                <ToggleButton size="small" color="primary" value={option}>
                  {option}
                </ToggleButton>
              ) : (
                <ToggleButton color={option?.color} value={option?.value}>
                  {option?.label}
                </ToggleButton>
              )
            )}
          </ToggleButtonGroup>
          {error && <FormHelperText error>{error?.message}</FormHelperText>}
        </>
      )}
    />
  );
}
