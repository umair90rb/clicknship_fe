import { type FormInputProps } from "@/types/form";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

interface FormInputPropsWithType extends FormInputProps {
  type?: string;
  autoFocus?: boolean;
}

export const FormInputText = ({
  name,
  control,
  label,
  type = "text",
  placeholder,
  disabled = false,
  setValue,
  autoFocus = false,
  helperText,
}: FormInputPropsWithType) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          autoFocus={autoFocus}
          disabled={disabled}
          helperText={error ? error.message : helperText}
          size="small"
          error={!!error}
          onChange={setValue ? (e) => setValue(e) : onChange}
          value={value}
          fullWidth
          label={label}
          type={type}
          placeholder={placeholder}
          slotProps={{
            inputLabel: { shrink: value || value === 0 },
          }}
          variant="outlined"
          sx={{
            "& input[type=number]": {
              "-moz-appearance": "textfield",
            },
            "& input[type=number]::-webkit-inner-spin-button": {
              "-webkit-appearance": "none",
              margin: 0,
            },
          }}
        />
      )}
    />
  );
};
