import PrimaryButton from '@/components/Button';
import Card from '@/components/Card';
import Container from '@/components/Container';
import HDivider from '@/components/Divider';
import { FormInputText } from '@/components/form/FormInput';
import FormInputSingleCheckbox from '@/components/form/FormSingleCheckbox';
import LinkButton from '@/components/LinkButton';
import Text from '@/components/Text';
import useLoginForm from '@/forms/login';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const [searchParams] = useSearchParams();
  const signup = searchParams.get('signup');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { form, onSubmit } = useLoginForm();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <CssBaseline enableColorScheme />
      <Container direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Text variant="h4" text="Log into your account" />
          {signup && <Text variant="body1" color='success' text="Signup successful, please login using email and password you entered during signup." />}
          <FormInputText name="email" control={form.control} label="Email" />
          <FormInputText
            type='password'
            name="password"
            control={form.control}
            label="Password"
          />
          <FormInputSingleCheckbox
            control={form.control}
            name={'rememberMe'}
            label='Remember Me'
          />
          <PrimaryButton type="button" onClick={onSubmit}  label={form.formState.isSubmitting ? "Logging In..." : "Sign In"} disabled={form.formState.isSubmitting} />
          <LinkButton label="Forgot your password?" onClick={() => navigate('/reset-password')} />
          <HDivider text="or" />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Text>
              Don&apos;t have an account?{' '}
              <LinkButton label="Sign up" onClick={() => window.location.replace(`http://${import.meta.env.VITE_BASE_URL}/signup`)} />
            </Text>
          </Box>
        </Card>
      </Container>
    </>
  );
}
