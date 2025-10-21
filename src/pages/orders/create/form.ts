import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

interface ICreateOrderForm {
  phone: string;
  status: string;
}

const schema = Yup.object({
  phone: Yup.string().required("Enter a valid phone number!"),
  status: Yup.string().required("Password is required!"),
});

const defaultValues = {
  phone: "03001234567",
  status: "mail@gmail.com",
};

export default function useSignupForm() {
  const form = useForm<ICreateOrderForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = form.handleSubmit(async (data: ICreateOrderForm) => {
    console.log(data);
  });

  return { form, onSubmit };
}
