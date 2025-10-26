import { type FormInputProps } from "@/types/form";
import {
  InputLabel,
  Autocomplete,
  TextField,
  Box,
  Checkbox,
} from "@mui/material";
import { Controller } from "react-hook-form";

interface FormAutoselectProps extends FormInputProps {
  options: any[];
  multiple?: boolean;
  disableCloseOnSelect?: boolean;
  setValue?: (value: any, options: any[]) => void;
  errorKey?: string | null;
}

export default function FormAutocomplete({
  name,
  control,
  label,
  placeholer,
  options,
  multiple = false,
  disableCloseOnSelect = multiple,
  setValue,
  errorKey,
  ...props
}: FormAutoselectProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box sx={{ width: "100%" }}>
          {label && <InputLabel color={error && "error"}>{label}</InputLabel>}
          <Autocomplete
            disablePortal
            autoHighlight
            clearOnEscape
            handleHomeEndKeys
            autoComplete
            disableCloseOnSelect={disableCloseOnSelect}
            freeSolo
            size="small"
            multiple={multiple}
            options={options}
            value={setValue ? setValue(value, options) : value}
            onChange={(_e, value) => onChange(value)}
            renderOption={
              multiple
                ? (props, option, { selected }) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        <Checkbox
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option}
                      </li>
                    );
                  }
                : undefined
            }
            renderInput={(params) => (
              <TextField
                error={Boolean(error)}
                helperText={
                  Boolean(error) && (error?.message || "Error in this field")
                }
                placeholder={placeholer}
                {...params}
              />
            )}
            {...props}
          />
        </Box>
      )}
    />
  );
}
