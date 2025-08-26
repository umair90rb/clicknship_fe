import useAuth from '@/hooks/useAuth';
import type { LoginRequestResponse } from '@/types/auth';
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
  const form = useForm<ILoginForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = form.handleSubmit(async (credentials: ILoginForm) => {
    const response = await fetch(
      `http://${window.location.hostname}/api/v1/auth/login`,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const {access_token, message}: LoginRequestResponse = await response.json();
    if(response.status === 201) {
      login(access_token);
    } else {
      form.setError('email', {});
      form.setError('password', {message});
    }
  });

  return { form, onSubmit };
}
