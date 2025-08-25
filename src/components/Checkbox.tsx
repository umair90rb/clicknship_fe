import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface CheckboxInputProps{
    label: string;
    value: string;
}

export default function CheckboxInput({label='', value=''}: CheckboxInputProps) {
  return (
    <FormControlLabel
      control={<Checkbox value={value} color="primary" />}
      label={label}
    />
  );
}
