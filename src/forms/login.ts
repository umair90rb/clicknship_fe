import { useLoginMutation } from '@/api/auth';
import useAuth from '@/hooks/useAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface ILoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const schema = Yup.object({
  email: Yup.string().email().required('Enter a valid email address!'),
  password: Yup.string().required('Password is required!'),
  rememberMe: Yup.bool().required(),
});

const defaultValues = {
  email: 'umair90rb@gmail.com',
  password: 'Palsa@123',
  rememberMe: false,
};

export default function useLoginForm() {
  const { login } = useAuth();
  const [fetchLogin] = useLoginMutation();
  const form = useForm<ILoginForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = form.handleSubmit(async (credentials: ILoginForm) => {
    return fetchLogin(credentials)
      .unwrap()
      .then((response) => login(response.access_token))
      .catch((err) => {
        let message = 'Something went wrong! Please try again later.';
        if (err.status === 'FETCH_ERROR') {
          message = 'Network Error! Please check your internet connection.';
        } else if (err.status === 401) {
          message = 'Invalid credentials. Please check your email and password.';
        } else if (err.data && err.data.message) {
          message = err.data.message;
        }
        form.setError('email', {});
        form.setError('password', { message });
      });
  });

  return { form, onSubmit };
}
