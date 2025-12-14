import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";

interface InputProps {
  name: string;
  value: any;
  onChange: (e: any) => void;
  type?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  autoFocus?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  sx?: {[key: string]: any}
}

export default function Input({
  name = "",
  value = null,
  onChange = (e: any) => {},
  error = "",
  type = "text",
  label = "",
  placeholder = "",
  autoFocus = true,
  required = true,
  fullWidth = true,
  sx = {}
}: InputProps) {
  return (
    <FormControl sx={{ width: "100%"}}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <TextField
        size="small"
        error={Boolean(error)}
        helperText={error}
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={name}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        required={required}
        fullWidth={fullWidth}
        color={error ? "error" : "primary"}
        sx={{
        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
          "-webkit-appearance": "none",
          display: "none",
        },
        "& input[type=number]": {
          MozAppearance: "textfield",
        },
        ...sx,
      }}
      />
    </FormControl>
  );
}
