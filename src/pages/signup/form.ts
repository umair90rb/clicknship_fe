import { useOnboardMutation } from "@/api/auth";
import type { OnboardRequestResponse } from "@/types/onboard";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

interface IOnboardForm {
  companyName: string;
  name: string;
  phone: string;
  email: string;
  password: string;
}

const schema = Yup.object({
  companyName: Yup.string().required("Enter a valid company name!"),
  name: Yup.string().required("Enter a valid name!"),
  phone: Yup.string().required("Enter a valid phone number!"),
  email: Yup.string().email().required("Enter a valid email address!"),
  password: Yup.string().required("Password is required!"),
});

const defaultValues = {
  companyName: "",
  name: "umair",
  phone: "03001234567",
  email: "mail@gmail.com",
  password: "Palsa@123",
};

export default function useSignupForm() {
  const [fetchOnboard] = useOnboardMutation();
  const form = useForm<IOnboardForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = form.handleSubmit(async (data: IOnboardForm) => {
    console.log(data);
    return fetchOnboard(data)
      .unwrap()
      .then((response: OnboardRequestResponse) => {
        const tenantId = response.tenantId;
        window.location.replace(
          `http://${tenantId}.${
            import.meta.env.VITE_BASE_URL
          }/login?message=Signup successful, please login using email and password you entered during signup&success=true`
        );
      })
      .catch((err) => {
        let message = "Something went wrong! Please try again later.";
        if (err.status === "FETCH_ERROR") {
          message = "Network Error! Please check your internet connection.";
        } else if (err.status === 400) {
          message = err.data.message;
          form.setError("companyName", { message });
          return;
        } else if (err.data && err.data.message) {
          message = err.data.message;
        }
        form.setError("password", { message });
      });
  });

  return { form, onSubmit };
}
