import { Checkbox, FormControlLabel } from '@mui/material';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

// The type for the single checkbox component props.
// It uses generics to be flexible with different form field names.
interface FormInputSingleCheckboxProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
}

/**
 * A reusable single checkbox component that integrates with React Hook Form.
 * @param {FormInputSingleCheckboxProps} props - The component props.
 * @param {string} props.name - The unique name of the form field.
 * @param {Control} props.control - The control object from useForm.
 * @param {string} props.label - The label for the checkbox.
 */
export default function FormInputSingleCheckbox<TFieldValues extends FieldValues>({
  name,
  control,
  label,
}: FormInputSingleCheckboxProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      // The render prop provides the field object, which contains
      // the value and change handler from React Hook Form.
      render={({ field }) => {
        // Use the spread operator to apply all field properties to the Checkbox.
        // The `value` from RHF is a boolean for a single checkbox.
        // `checked` is an alias for `value` and is expected by the MUI Checkbox.
        // The `onChange` handler from RHF updates the form state.
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
