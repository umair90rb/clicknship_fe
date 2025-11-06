import { Checkbox, FormControlLabel } from "@mui/material";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface FormInputSingleCheckboxProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
}

export default function FormInputSingleCheckbox<
  TFieldValues extends FieldValues
>({ name, control, label }: FormInputSingleCheckboxProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={!!field.value} // Ensure the value is a boolean for the 'checked' prop
              />
            }
            label={label}
          />
        );
      }}
    />
  );
}
