import { type FormInputProps } from "@/types/form";
import { Box, FormHelperText, InputLabel, Rating } from "@mui/material";
import { Controller } from "react-hook-form";

interface FormRatingProps extends FormInputProps {
  max?: number;
}

export const FormRating = ({
  name,
  control,
  label,
  max = 5,
  disabled = false,
}: FormRatingProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box>
          {label && <InputLabel sx={{ mb: 0.5 }}>{label}</InputLabel>}
          <Rating
            value={value ?? 0}
            onChange={(_, newValue) => onChange(newValue)}
            max={max}
            disabled={disabled}
            size="large"
          />
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Box>
      )}
    />
  );
};

export default FormRating;
