import { Box } from "@mui/material";
import PrimaryButton from "./Button";

export default function PrivacyPolicy() {
  return (
    <Box textAlign={"center"}>
      <PrimaryButton
        label="Privacy Policy"
        href={`http://${import.meta.env.VITE_BASE_URL}/terms-of-use`}
        blank
        variant="text"
      />
      {"  "}|{"  "}
      <PrimaryButton
        label="Privacy Policy"
        href={`http://${import.meta.env.VITE_BASE_URL}/privacy-policy`}
        blank
        variant="text"
      />
    </Box>
  );
}
