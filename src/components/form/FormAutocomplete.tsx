import { type FormInputProps } from "@/types/form";
import { InputLabel, Autocomplete, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

interface FormAutoselectProps extends FormInputProps {
  options: any[];
  multiple?: boolean;
}

export default function FormAutocomplete({
  name,
  control,
  label,
  placeholer,
  options,
  multiple = false,
}: FormAutoselectProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          {label && <InputLabel color={error && "error"}>{label}</InputLabel>}
          <Autocomplete
            disablePortal
            autoHighlight
            clearOnEscape
            freeSolo
            size="small"
            multiple={multiple}
            options={options}
            value={value}
            onChange={(_e, value) => onChange(value)}
            renderInput={(params) => (
              <TextField
                error={!!error}
                helperText={error?.message}
                placeholder={placeholer}
                {...params}
              />
            )}
          />
        </>
      )}
    />
  );
}
