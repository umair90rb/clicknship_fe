import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface ISignupForm {
  companyName: string;
  name: string;
  phone: string;
  email: string;
  password: string;
}

const schema = Yup.object({
  companyName: Yup.string().required('Enter a valid company name!'),
  name: Yup.string().required('Enter a valid name!'),
  phone: Yup.string().required('Enter a valid phone number!'),
  email: Yup.string().email().required('Enter a valid email address!'),
  password: Yup.string().required('Password is required!'),
});

const defaultValues = {
  companyName: '',
  name: '',
  phone: '',
  email: '',
  password: '',
};

export default function useSignupForm() {
  const form = useForm<ISignupForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = form.handleSubmit((data: ISignupForm) => {
    console.log(data);
  });

  return { form, onSubmit };
}
