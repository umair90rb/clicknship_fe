import CustomTable from "@/components/CustomTable";
import FormAutocomplete from "@/components/form/FormAutocomplete";
import { FormInputText } from "@/components/form/FormInput";
import CustomIconButton from "@/components/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import type { Item } from "@/types/orders/detail";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { getErrorMessage } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import FormRootError from "@/components/form/FormRootError";
import { usePostOrderItemMutation } from "@/api/orders";
import { useEffect } from "react";

const schema = Yup.object({
  name: Yup.string(),
  sku: Yup.string(),
  productId: Yup.string(),
  variantId: Yup.string(),
  grams: Yup.number()
    .transform((v, ov) => (ov === "" ? null : v))
    .nullable()
    .positive("Must be greater than 0"),
  quantity: Yup.number()
    .transform((v, ov) => (ov === "" ? null : v))
    .nullable()
    .positive("Must be greater than 0")
    .required("Please enter quantity"),
  discount: Yup.number()
    .transform((v, ov) => (ov === "" ? null : v))
    .nullable()
    .test(
      "discount-not-greater",
      "Discount cannot exceed unit price X quantity",
      function (value) {
        const { unitPrice, quantity } = this.parent;
        if (value == null || unitPrice == null || quantity == null) return true;
        return value <= unitPrice * quantity;
      }
    )
    .min(0, "Discount cannot be negative"),
  unitPrice: Yup.number()
    .transform((v, ov) => (ov === "" ? null : v))
    .nullable()
    .positive("Must be greater than 0"),
  total: Yup.number(),
});

const columns = [
  {
    label: "Product",
    width: 180,
    render: (row: Item) => `${row.name} (${row.sku})`,
  },
  { id: "grams", label: "Grams", width: 50, align: "right" },
  { id: "quantity", label: "Quantity", width: 50, align: "right" },
  { id: "discount", label: "Discount", width: 50, align: "right" },
  { id: "unitPrice", label: "Price", width: 50, align: "right" },
  {
    label: "Total",
    width: 50,
    align: "right",
    render: (row: Item) => row.unitPrice * row.quantity,
  },
];

const items = [
  {
    id: 1,
    name: "JOINT ON 50 ML",
    unitPrice: 2000,
    grams: 0,
    sku: "JNT-50",
    productId: null,
    variantId: null,
  },
  {
    id: 2,
    name: "JOINT ON 20 ML",
    unitPrice: 1500,
    grams: 0,
    sku: "JNT-20",
    productId: null,
    variantId: null,
  },
  {
    id: 3,
    name: "FLEX ON 20 ML",
    unitPrice: 2500,
    grams: 0,
    sku: "FLX-50",
    productId: null,
    variantId: null,
  },
];

type TItemForm = Omit<Item, "orderId" | "discount"> & {
  total: number;
  discount: number;
};

export default function ItemsTable({
  orderId,
  items: orderItems,
}: {
  orderId: number;
  items: Item[];
}) {
  const [posttItem, { isLoading }] = usePostOrderItemMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<TItemForm>({
    // defaultValues: {
    //   total: 0,
    //   discount: 0,
    //   id: undefined,
    //   name: undefined,
    //   unitPrice: undefined,
    //   grams: undefined,
    //   quantity: 1,
    //   sku: undefined,
    //   productId: undefined,
    //   variantId: undefined,
    // },
    resolver: yupResolver(schema),
  });

  const [discount, quantity, unitPrice] = watch([
    "discount",
    "quantity",
    "unitPrice",
  ]);

  useEffect(() => {
    let total: number = 0;
    if (unitPrice) total = unitPrice * quantity;
    if (unitPrice && discount) total -= discount;
    setValue("total", total, {
      shouldTouch: true,
    });
    clearErrors(["total", "quantity"]);
  }, [discount, quantity, unitPrice]);

  const onSubmit = async (data: TItemForm) => {
    console.log(data, "body");
    // posttItem({ id: orderId, body })
    //   .unwrap()
    //   .then(() => {})
    //   .catch((error) => setError("root", { message: getErrorMessage(error) }));
  };
  return (
    <Box
      sx={{
        minHeight: 250,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CustomTable rowIdKey="id" columns={columns} rows={orderItems} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 1,
        }}
      >
        <Box sx={{ flexBasis: "300%" }}>
          <FormAutocomplete
            label="Select Item"
            placeholer="Select Item"
            name="name"
            options={items}
            control={control}
            // isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name ?? ""}
            onChange={(e, value) => {
              clearErrors(["name"]);
              Object.keys(value || items[0]).forEach((k) =>
                setValue(k, value && k in value ? value[k] : "", {
                  shouldTouch: true,
                })
              );
            }}
          />
        </Box>
        <FormInputText
          label="Quantity"
          name="quantity"
          type="number"
          control={control}
        />
        <FormInputText
          label="Discount"
          name="discount"
          type="number"
          control={control}
        />
        <FormInputText
          label="Unit Price"
          name="unitPrice"
          type="number"
          control={control}
          disabled
        />
        <FormInputText
          label="Total"
          name="total"
          type="number"
          control={control}
          disabled
        />
        <FormRootError errors={errors} />
        <CustomIconButton
          Icon={AddBoxIcon}
          size="large"
          onClick={handleSubmit(onSubmit)}
        />
      </Box>
    </Box>
  );
}
