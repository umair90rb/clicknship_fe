import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import type { Address } from "@/types/orders/detail";

const schema = Yup.object({
  address: Yup.string().required("Enter valid address!"),
  note: Yup.string().nullable().optional().required("Enter a valid note!"),
  city: Yup.string().required("Select a city!"),
});

type TAddress = Pick<Address, "address" | "city" | "note">;

export default function useAddressForm(address: Address) {
  const form = useForm<TAddress>({
    defaultValues: address,
    resolver: yupResolver(schema),
  });

  const onSubmit = form.handleSubmit(async (data: TAddress) => {
    console.log(data);
  });

  return { form, onSubmit };
}
