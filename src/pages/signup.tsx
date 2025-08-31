import PrimaryButton from '@/components/Button';
import Card from '@/components/Card';
import Container from '@/components/Container';
import { FormInputText } from '@/components/form/FormInput';
import Text from '@/components/Text';
import useSignupForm from '@/forms/signup';
import CssBaseline from '@mui/material/CssBaseline';

export default function SignUp() {
  const { form, onSubmit } = useSignupForm();

  return (
    <>
      <CssBaseline enableColorScheme />
      <Container direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Text variant="h4" textAlign='center' text="Sign Up" />
          <FormInputText name="companyName" control={form.control} label="Company Name" />
          <FormInputText name="name" control={form.control} label="Name" />
          <FormInputText name="phone" control={form.control} label="Phone" />
          <FormInputText name="email" control={form.control} label="Email" />
          <FormInputText
            name="password"
            control={form.control}
            label="Password"
          />
          <PrimaryButton type="button" disabled={form.formState.isSubmitting} onClick={onSubmit} label={form.formState.isSubmitting ? "Wait, Setting up things for you..." :"Sign Up"} />
          {/* <LinkButton label="Forgot your password?" onClick={() => navigate('/reset-password')} /> */}
          {/* <HDivider text="or" /> */}
          {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Text>
              Already have an account?{' '}
              <LinkButton label="Login" onClick={() => navigate('/login')} />
            </Text>
          </Box> */}
        </Card>
      </Container>
    </>
  );
}
