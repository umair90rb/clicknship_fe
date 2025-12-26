import { type FormInputProps } from "@/types/form";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller } from "react-hook-form";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface FormSelectProps extends FormInputProps {
  options: SelectOption[];
}

export const FormSelect = ({
  name,
  control,
  label,
  options,
  disabled = false,
}: FormSelectProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl size="small" fullWidth error={!!error} disabled={disabled}>
          <InputLabel>{label}</InputLabel>
          <Select onChange={onChange} value={value ?? ""} label={label}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default FormSelect;
