import { useEffect, useCallback } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

/* -------------------------
   Types
   ------------------------- */
export interface IOrderItem {
  id?: string | number; // optional field-array id
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
  id: string;
  name: string;
  phone: string;
}

export interface IAddress {
  address: string;
  note: string;
  city: string;
  zip: string;
}

export interface IPayments {
  bank: string;
  tId: string;
  type: string;
  amount: string;
  note: string;
}

export interface ICreateOrderForm {
  customer: ICustomer;
  address: IAddress;
  tax: number;
  shippingCharges: number;
  channelId: string | null;
  brandId: string | null;
  items: IOrderItem[];
  payments: IPayments[];
}

/* -------------------------
   Validation
   ------------------------- */
const schema = Yup.object({
  customer: Yup.object({
    phone: Yup.string().required("Enter a valid phone number!"),
    name: Yup.string().required("Enter customer name!"),
  }),
});

/* -------------------------
   Defaults
   ------------------------- */
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
  customer: { id: "", name: "", phone: "" },
  address: { address: "", note: "", city: "", zip: "" },
  tax: 0,
  shippingCharges: 0,
  channelId: null,
  brandId: null,
  items: [defaultItem()],
  payments: [{ bank: "", tId: "", type: "", amount: "", note: "" }],
};

/* -------------------------
   Hook
   ------------------------- */
export default function useCreateOrderForm() {
  const form = useForm<ICreateOrderForm>({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { control, handleSubmit, setValue, getValues } = form;

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
  const orderItemsTotal = (watchedItems || []).reduce(
    (sum, it) => sum + Number(it.total || 0),
    0
  );
  const orderOverallTotal =
    orderItemsTotal + Number(watchedTax || 0) + Number(watchedShipping || 0);

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

  /**
   * updateItemFromSelection
   * - selectedItem is the object returned by autocomplete (mockItems entry)
   * - It will override item fields except quantity and discount (kept from current item)
   */
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

  /* ---------------------------
     submit
     --------------------------- */
  const onSubmit = handleSubmit(async (data) => {
    // final server-ready transformation can be done here
    // make sure to guard numeric types
    console.log(data);
    const payload = {
      ...data,
      items: data.items.map((it) => ({
        ...it,
        unitPrice: Number(it.unitPrice || 0),
        quantity: Number(it.quantity || 0),
        discount: Number(it.discount || 0),
        total: Number(it.total || 0),
        grams: Number(it.grams || 0),
      })),
      tax: Number(data.tax || 0),
      shippingCharges: Number(data.shippingCharges || 0),
      orderOverallTotal,
    };
    // placeholder: replace with actual API call
    // await api.createOrder(payload)
    console.log("SUBMIT payload", payload);
  });

  return {
    form,
    fields,
    addItem,
    addItemAfter,
    removeItem,
    updateItemFromSelection,
    orderItemsTotal,
    orderOverallTotal,
    onSubmit,
  };
}
