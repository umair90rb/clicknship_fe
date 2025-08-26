import { type FormInputProps } from '@/types/form';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

interface IOption {
  label: string;
  value: string;
}

interface FormInputMultiCheckboxProps extends FormInputProps {
  options: IOption[];
}

export const FormInputMultiCheckbox: React.FC<FormInputMultiCheckboxProps> = ({
  name,
  control,
  label,
  options,
}) => {
  return (
    <FormControl size={'small'} variant={'outlined'}>
      <FormLabel component="legend">{label}</FormLabel>
      <div>
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const { onChange, value: selectedValues } = field;

            // Ensure selectedValues is always an array
            const currentSelected = Array.isArray(selectedValues)
              ? selectedValues
              : [];

            const handleToggle = (value: string) => {
              const newSelected = currentSelected.includes(value)
                ? currentSelected.filter((item) => item !== value)
                : [...currentSelected, value];

              onChange(newSelected);
            };

            return (
              <>
                {options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        checked={currentSelected.includes(option.value)}
                        onChange={() => handleToggle(option.value)}
                      />
                    }
                    label={option.label}
                  />
                ))}
              </>
            );
          }}
        />
      </div>
    </FormControl>
  );
};
