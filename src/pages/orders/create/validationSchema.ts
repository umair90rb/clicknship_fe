import * as Yup from "yup";

export const orderSchema = Yup.object({
  customer: Yup.object({
    name: Yup.string().required("Customer name is required"),
    phone: Yup.string().required("Customer phone is required"),
  }),
  address: Yup.object({
    address: Yup.string().required("Address is required"),
    note: Yup.string().nullable(),
    city: Yup.string().required("City is required"),
  }),
  tax: Yup.number().min(0).required(),
  shippingCharges: Yup.number().min(0).required(),
  channel: Yup.object({
    name: Yup.string().required("Please select order channel"),
  }),
  items: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required(),
        quantity: Yup.number().required().min(1),
      })
    )
    .min(1, "At least one item is required"),

  payment: Yup.object({
    amount: Yup.number()
      .min(0, "Amount must be 0 or greater")
      .required("Amount is required"),

    bank: Yup.string().when(["amount", "type"], {
      is: (amount: number, type: string) => amount > 0 && type === "Transfer",
      then: (schema) => schema.required("Bank is required"),
      otherwise: (schema) => schema.optional(),
    }),

    tId: Yup.string().when(["amount", "type"], {
      is: (amount: number, type: string) => amount > 0 && type === "Transfer",
      then: (schema) => schema.required("Transaction ID is required"),
      otherwise: (schema) => schema.optional(),
    }),

    type: Yup.string().when("amount", {
      is: (amount: number) => amount > 0,
      then: (schema) => schema.required("Payment type is required"),
      otherwise: (schema) => schema.optional(),
    }),

    note: Yup.string().nullable(),
  }),
});
