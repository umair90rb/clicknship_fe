import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface ILoginForm {
  email: string;
}

const schema = Yup.object({
  email: Yup.string().email().required('Enter a valid email address!'),
});

const defaultValues = {
  email: '',
};

export default function useResetPasswordForm() {
  const form = useForm<ILoginForm>({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const onSubmit = form.handleSubmit((data: ILoginForm) => {
    console.log(data);
  })

  return {form, onSubmit}
}
