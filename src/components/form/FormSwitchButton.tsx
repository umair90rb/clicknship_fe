import { Switch, FormLabel, Box } from "@mui/material";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface FormFormSwitchButtonProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
}

export default function FormSwitchButton<TFieldValues extends FieldValues>({
  name,
  control,
  label,
}: FormFormSwitchButtonProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {label && <FormLabel>{label}</FormLabel>}
            <Switch onChange={onChange} value={value} checked={value} />
          </Box>
        );
      }}
    />
  );
}
