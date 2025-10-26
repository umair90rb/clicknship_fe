import { useEffect, useCallback } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { orderSchema } from "./validationSchema";
import {
  useCreateOrderMutation,
  useSearchCustomerMutation,
} from "@/api/orders";

export interface IOrderItem {
  id?: string | number;
  name: string;
  sku: string;
  grams: number;
  unitPrice: number;
  quantity: number;
  discount: number;
  total: number;
  productId: string | null;
  variantId: string | null;
}

export interface ICustomer {
  id?: number | null;
  name: string;
  phone: string;
  email: string;
}

export interface IAddress {
  id?: string | null;
  address: string;
  note: string;
  city: string;
}

export interface IPayment {
  bank: string;
  tId: string;
  type: string;
  amount: number;
  note: string;
}

export interface ICreateOrderForm {
  customer: ICustomer;
  address: IAddress;
  tax: number;
  shippingCharges: number;
  channel: {
    id: number | null;
    name: string | null;
    brandId: number | null;
  };
  remarks: string | null;
  tags: string[];
  items: IOrderItem[];
  payment: IPayment;
}

const defaultItem = (): IOrderItem => ({
  name: "",
  sku: "",
  grams: 0,
  unitPrice: 0,
  quantity: 1,
  discount: 0,
  total: 0,
  productId: null,
  variantId: null,
});

const defaultValues: ICreateOrderForm = {
  customer: { id: null, name: "", phone: "", email: "" },
  address: { address: "", note: "", city: "" },
  tax: 0,
  shippingCharges: 0,
  channel: {
    id: null,
    name: null,
    brandId: null,
  },
  items: [defaultItem()],
  payment: { bank: "", tId: "", type: "", amount: 0, note: "" },
  remarks: "",
  tags: [],
};

export default function useCreateOrderForm() {
  const form = useForm<ICreateOrderForm>({
    defaultValues,
    resolver: yupResolver(orderSchema),
    mode: "onChange",
  });

  const { control, handleSubmit, setValue, getValues, setError } = form;

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "items",
    keyName: "fieldId", // avoid conflicting "id" in item objects
  });

  // watch items, tax, shippingCharges to recalc totals
  const watchedItems = useWatch({
    control,
    name: "items",
  }) as IOrderItem[];

  const watchedTax = useWatch({
    control,
    name: "tax",
  }) as number;

  const watchedShipping = useWatch({
    control,
    name: "shippingCharges",
  }) as number;

  const watchedPaymentAmount = useWatch({
    control,
    name: "payment.amount",
  }) as number;

  // helper: calculate single item total
  const calcItemTotal = useCallback((it: IOrderItem) => {
    // ensure numeric values
    const unit = Number(it.unitPrice || 0);
    const qty = Number(it.quantity || 0);
    const disc = Number(it.discount || 0);
    return +(unit * qty - disc); // may be negative if discount > price*qty (business rule)
  }, []);

  // effect: recalc and set per-item totals when items change (unitPrice, qty, discount, name, etc)
  useEffect(() => {
    if (!Array.isArray(watchedItems)) return;

    watchedItems.forEach((it, idx) => {
      const computed = calcItemTotal(it);
      // only set if different to avoid unnecessary re-renders
      if ((it.total ?? 0) !== computed) {
        setValue(`items.${idx}.total`, computed, {
          shouldDirty: true,
          shouldTouch: false,
          shouldValidate: false,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedItems, calcItemTotal, setValue]);

  // compute overall order total (derived)
  const [orderItemsTotal, orderItemsTotalDisc] = (watchedItems || []).reduce(
    (sum, it) => [
      sum[0] + Number(it.total || 0),
      sum[1] + Number(it.discount || 0),
    ],
    [0, 0]
  );
  const orderOverallTotal =
    orderItemsTotal +
    Number(watchedTax || 0) +
    Number(watchedShipping || 0) -
    Number(watchedPaymentAmount || 0);

  /* ---------------------------
     API for items manip
     --------------------------- */
  const addItem = () => {
    append(defaultItem());
  };

  const addItemAfter = (index: number) => {
    // insert after index
    insert(index + 1, defaultItem());
  };

  const removeItem = (index: number) => {
    // keep at least one row if needed — optional behavior
    if (fields.length <= 1) {
      // reset the only row instead of removing
      setValue("items.0", defaultItem(), { shouldDirty: true });
      return;
    }
    remove(index);
  };

  const updateItemFromSelection = (
    index: number,
    selectedItem: Partial<IOrderItem> | null
  ) => {
    if (!selectedItem) {
      // if user cleared selection, reset some fields but keep quantity & discount
      const current = getValues(`items.${index}`);
      const resetItem = {
        ...defaultItem(),
        quantity: current?.quantity ?? 1,
        discount: current?.discount ?? 0,
      };
      setValue(`items.${index}`, resetItem, { shouldDirty: true });
      return;
    }

    const current = getValues(`items.${index}`) as IOrderItem | undefined;

    const updated: IOrderItem = {
      ...current, // keep quantity & discount if present
      ...selectedItem,
      quantity: current?.quantity ?? selectedItem.quantity ?? 1,
      discount: current?.discount ?? selectedItem.discount ?? 0,
      // ensure total exists, will be recalculated by effect
      total: calcItemTotal({
        ...(current ?? defaultItem()),
        ...selectedItem,
        quantity: current?.quantity ?? selectedItem.quantity ?? 1,
        discount: current?.discount ?? selectedItem.discount ?? 0,
      }),
    };

    // set all known fields
    // NOTE: setValue accepts partial path; setting whole object is cleaner
    setValue(`items.${index}`, updated, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // useEffect(() => {
  //   console.log(form.formState.errors);
  // }, [form.formState]);

  const [
    searchCustomer,
    { isLoading: isSearchingCustomer, data: customerSearchData },
  ] = useSearchCustomerMutation();
  const onSearchCustomer = async () => {
    const phone = getValues("customer.phone");
    if (phone) {
      await searchCustomer({ phone, withAddress: true }).unwrap();
      return;
    }
    setError("customer.phone", {
      message: "Please enter valid phone before searching",
    });
  };

  useEffect(() => {
    if (customerSearchData && Object.keys(customerSearchData).length) {
      const { addresses, orders, name, email, id } = customerSearchData || {};
      id && setValue("customer.id", id);
      name && setValue("customer.name", name);
      email && setValue("customer.email", email);
      if (addresses && Array.isArray(addresses) && addresses.length) {
        const { id, address, city, note } = addresses[0];
        setValue("address.id", id);
        setValue("address.address", address);
        setValue("address.city", city);
        setValue("address.note", note);
      }
    }
  }, [customerSearchData]);

  /* ---------------------------
     submit
     --------------------------- */

  const [
    createOrder,
    {
      isLoading: isCreatingOrder,
      error: orderCreationError,
      isSuccess: orderCreatedSuccessfully,
    },
  ] = useCreateOrderMutation();
  const onSubmit = async (data: any, status: string) => {
    const { payment, channel, ...order } = data;
    const payload = {
      ...order,
      items: data.items.map(({ total, ...it }) => ({
        ...it,
        unitPrice: Number(it.unitPrice || 0),
        quantity: Number(it.quantity || 0),
        discount: Number(it.discount || 0),
        grams: Number(it.grams || 0),
      })),
      channelId: channel.id,
      brandId: channel.id,
      totalTax: Number(data.tax || 0),
      shippingCharges: Number(data.shippingCharges || 0),
      totalAmount: orderOverallTotal,
      totalDiscount: orderItemsTotalDisc,
      ...(payment.amount > 0 ? { payments: [payment] } : {}),
      status,
    };
    // placeholder: replace with actual API call
    // await api.createOrder(payload)
    console.log("SUBMIT payload", payload);
    await createOrder(payload);
  };

  return {
    form,
    fields,
    addItem,
    addItemAfter,
    removeItem,
    updateItemFromSelection,
    onSearchCustomer,
    isSearchingCustomer,
    orderItemsTotal,
    orderItemsTotalDisc,
    watchedPaymentAmount,
    watchedShipping,
    orderOverallTotal,
    handleSubmit,
    onSubmit,
    isCreatingOrder,
    orderCreatedSuccessfully,
    orderCreationError,
  };
}
