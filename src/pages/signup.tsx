import PrimaryButton from '@/components/Button';
import Card from '@/components/Card';
import Container from '@/components/Container';
import HDivider from '@/components/Divider';
import { FormInputText } from '@/components/form/FormInput';
import LinkButton from '@/components/LinkButton';
import Text from '@/components/Text';
import useSignupForm from '@/forms/signup';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { useNavigate } from 'react-router';

export default function SignUp() {
  const navigate = useNavigate();
  const { form, onSubmit } = useSignupForm();

  return (
    <>
      <CssBaseline enableColorScheme />
      <Container direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Text variant="h4" textAlign='center' text="Sign Up" />
          <FormInputText name="text" control={form.control} label="Company Name" />
          <FormInputText name="text" control={form.control} label="Name" />
          <FormInputText name="text" control={form.control} label="Phone" />
          <FormInputText name="email" control={form.control} label="Email" />
          <FormInputText
            name="password"
            control={form.control}
            label="Password"
          />
          <PrimaryButton type="button" onClick={onSubmit} label="Sign Up" />
          <LinkButton label="Forgot your password?" onClick={() => navigate('/reset-password')} />
          <HDivider text="or" />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Text>
              Already have an account?{' '}
              <LinkButton label="Login" onClick={() => navigate('/login')} />
            </Text>
          </Box>
        </Card>
      </Container>
    </>
  );
}
