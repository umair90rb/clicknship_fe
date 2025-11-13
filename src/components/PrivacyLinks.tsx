import { Box } from "@mui/material";
import LinkButton from "./LinkButton";

export default function PrivacyPolicy() {
  return (
    <Box textAlign={"center"}>
      <LinkButton
        label="Terms of Use"
        onClick={() =>
          window.open(
            `http://${import.meta.env.VITE_BASE_URL}/terms-of-use`,
            "_blank",
            "noopener"
          )
        }
      />
      {"  "}|{"  "}
      <LinkButton
        label="Privacy Policy"
        onClick={() =>
          window.open(
            `http://${import.meta.env.VITE_BASE_URL}/privacy-policy`,
            "_blank",
            "noopener"
          )
        }
      />
    </Box>
  );
}
