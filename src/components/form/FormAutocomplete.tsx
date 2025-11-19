import { type FormInputProps } from "@/types/form";
import {
  InputLabel,
  Autocomplete,
  TextField,
  Box,
  Checkbox,
} from "@mui/material";
import { Controller } from "react-hook-form";

interface FormAutoSelectProps extends FormInputProps {
  options: any[];
  multiple?: boolean;
  disableCloseOnSelect?: boolean;
  setValue?: (value: any, options: any[]) => void;
  getOptionLabel?: (option: any) => string;
  getOptionValue?: (option: any) => any;
  errorKey?: string | null;
  loading?: boolean;
}

export default function FormAutocomplete({
  name,
  control,
  label,
  placeholder,
  options,
  multiple = false,
  disableCloseOnSelect = multiple,
  setValue,
  getOptionLabel,
  getOptionValue,
  errorKey,
  loading = false,
  ...props
}: FormAutoSelectProps) {
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
            loading={loading}
            clearOnEscape
            handleHomeEndKeys
            autoComplete
            disableCloseOnSelect={disableCloseOnSelect}
            freeSolo
            size="small"
            multiple={multiple}
            options={options}
            getOptionLabel={getOptionLabel}
            value={setValue ? setValue(value, options) : value}
            onChange={(_e, value) =>
              onChange(getOptionValue ? getOptionValue(value) : value)
            }
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
                placeholder={placeholder}
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
