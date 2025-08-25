
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';

interface InputProps {
    type: string;
    label?: string;
    name: string;
    error: string;
    placeholder: string;
}

export default function Input({type='text', name='', label='', error='', placeholder=''}: InputProps){

    return <FormControl>
              {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
              <TextField
                error={Boolean(error)}
                helperText={error}
                id={name}
                type={type}
                name={name}
                placeholder={placeholder}
                autoComplete={name}
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={error ? 'error' : 'primary'}
              />
            </FormControl>

}