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
  rememberMe: Yup.bool().required()
});

const defaultValues = {
  email: '',
  password: '',
  rememberMe: false,
};

export default function useLoginForm() {
  const form = useForm<ILoginForm>({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const onSubmit = form.handleSubmit((data: ILoginForm) => {
    console.log(data);
  })

  return {form, onSubmit}
}
