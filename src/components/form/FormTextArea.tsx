import { type FormInputProps } from "@/types/form";
import { TextareaAutosize, FormHelperText, InputLabel } from "@mui/material";
import { Controller } from "react-hook-form";

interface FormTextAreaProps extends FormInputProps {
  minRows?: number;
  maxRows?: number;
  placeholder?: string;
}

export const FormInputTextArea = ({
  name,
  control,
  label,
  minRows = 2,
  maxRows = 5,
  placeholder = label,
}: FormTextAreaProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          {label && <InputLabel>{label}</InputLabel>}
          <TextareaAutosize
            onChange={onChange}
            value={value}
            maxRows={maxRows}
            minRows={minRows}
            placeholder={placeholder}
            style={{ width: "100%", fontSize: 14, borderColor: error && "red" }}
          />
          {error && <FormHelperText error>{error?.message}</FormHelperText>}
        </>
      )}
    />
  );
};
