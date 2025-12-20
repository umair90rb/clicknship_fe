import PrimaryButton from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { FormInputText } from "@/components/form/FormInput";
import Logo from "@/components/Logo";
import PrivacyPolicy from "@/components/PrivacyLinks";
import Text from "@/components/Text";
import useSignupForm from "@/pages/signup/form";
import CssBaseline from "@mui/material/CssBaseline";
// import HDivider from "@/components/Divider";
// import LinkButton from "@/components/LinkButton";
// import { Box } from "@mui/material";
// import { useNavigate } from "react-router";

export default function SignUp() {
  const { form, onSubmit } = useSignupForm();
  // const navigate = useNavigate();

  return (
    <>
      <CssBaseline enableColorScheme />
      <Container direction="column" justifyContent="space-between">
        <Logo icon />
        <Card variant="outlined">
          <Text variant="h4" textAlign="center" text="Sign Up" />
          <FormInputText
            name="companyName"
            control={form.control}
            label="Company Name"
          />
          <FormInputText name="name" control={form.control} label="Name" />
          <FormInputText name="phone" control={form.control} label="Phone" />
          <FormInputText name="email" control={form.control} label="Email" />
          <FormInputText
            name="password"
            control={form.control}
            label="Password"
          />
          <PrimaryButton
            type="button"
            disabled={form.formState.isSubmitting}
            onClick={onSubmit}
            label={
              form.formState.isSubmitting
                ? "Wait, Setting up things for you..."
                : "Sign Up"
            }
          />
          {/* <HDivider text="or" />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Text>
              Already have an account?{" "}
              <LinkButton label="Login" onClick={() => navigate("/login")} />
            </Text>
          </Box> */}
          <PrivacyPolicy />
        </Card>
      </Container>
    </>
  );
}
