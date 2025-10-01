import { type FormInputProps } from "@/types/form";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

interface FormInputPropsWithType extends FormInputProps {
  type?: string;
}

export const FormInputText = ({
  name,
  control,
  label,
  type = "text",
  placeholer,
}: FormInputPropsWithType) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          helperText={error ? error.message : null}
          size="small"
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          type={type}
          placeholder={placeholer}
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
