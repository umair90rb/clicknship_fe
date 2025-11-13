import PrimaryButton from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import HDivider from "@/components/Divider";
import { FormInputText } from "@/components/form/FormInput";
import LinkButton from "@/components/LinkButton";
import Logo from "@/components/Logo";
import PrivacyPolicy from "@/components/PrivacyLinks";
import Text from "@/components/Text";
import useResetPasswordForm from "@/pages/reset-password/form";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { form, onSubmit } = useResetPasswordForm();

  return (
    <>
      <CssBaseline enableColorScheme />
      <Container direction="column" justifyContent="space-between">
        <Logo />
        <Card variant="outlined">
          <Text textAlign="center" variant="h4" text="Reset Password" />
          <FormInputText name="email" control={form.control} label="Email" />
          <PrimaryButton
            type="button"
            onClick={onSubmit}
            label="Reset Password"
          />
          <HDivider text="or" />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Text textAlign="center">
              <LinkButton label="Sign In" onClick={() => navigate("/login")} />{" "}
              to your account!
            </Text>
          </Box>
        </Card>
        <PrivacyPolicy />
      </Container>
    </>
  );
}
