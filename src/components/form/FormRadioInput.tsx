import { type FormInputProps } from '@/types/form';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

const options = [
  {
    label: 'Radio Option 1',
    value: '1',
  },
  {
    label: 'Radio Option 2',
    value: '2',
  },
];

export const FormInputRadio: React.FC<FormInputProps> = ({
  name,
  control,
  label,
}) => {
  const generateRadioOptions = () => {
    return options.map((singleOption) => (
      <FormControlLabel
        value={singleOption.value}
        label={singleOption.label}
        control={<Radio />}
      />
    ));
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            {' '}
            <RadioGroup value={value} onChange={onChange}>
              {generateRadioOptions()}
            </RadioGroup>
            {!!error && <FormHelperText id={`${name}-helper-text`}>
              {error?.message}
            </FormHelperText>}
          </>
        )}
      />
    </FormControl>
  );
};
