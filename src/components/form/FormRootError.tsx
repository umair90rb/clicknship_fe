import { Box } from "@mui/material";
import Text from "../Text";
import type { FieldErrors } from "react-hook-form";

interface FormRootErrorProps {
  errors: FieldErrors;
}

export default function FormRootError({ errors }: FormRootErrorProps) {
  const { root } = errors || {};
  return (
    root && (
      <Box mt={1}>
        <Text color="error">{root?.message}</Text>
      </Box>
    )
  );
}
