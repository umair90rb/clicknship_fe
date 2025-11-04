// import CustomTable from "@/components/CustomTable";
// import FormAutocomplete from "@/components/form/FormAutocomplete";
// import { FormInputText } from "@/components/form/FormInput";
// import CustomIconButton from "@/components/IconButton";
// import AddBoxIcon from "@mui/icons-material/AddBox";
// import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
// import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
// import type { Item } from "@/types/orders/detail";
// import { Box } from "@mui/material";
// import { useForm } from "react-hook-form";
// import * as Yup from "yup";
// import { getErrorMessage } from "@/utils";
// import { yupResolver } from "@hookform/resolvers/yup";
// import FormRootError from "@/components/form/FormRootError";
// import {
//   selectOrderById,
//   useCreateOrderItemMutation,
//   useDeleteOrderItemMutation,
//   useUpdateOrderItemMutation,
// } from "@/api/orders";
// import { useEffect } from "react";
// import { useSelector } from "react-redux";

// const schema = Yup.object({
//   name: Yup.string(),
//   sku: Yup.string(),
//   productId: Yup.string().nullable(),
//   variantId: Yup.string().nullable(),
//   grams: Yup.number()
//     .transform((v, ov) => (ov === "" ? null : v))
//     .nullable()
//     .min(0, "Must be greater than 0"),
//   quantity: Yup.number()
//     .transform((v, ov) => (ov === "" ? null : v))
//     .nullable()
//     .positive("Must be greater than 0")
//     .required("Please enter quantity"),
//   discount: Yup.number()
//     .transform((v, ov) => (ov === "" ? null : v))
//     .nullable()
//     .test(
//       "discount-not-greater",
//       "Discount cannot exceed unit price X quantity",
//       function (value) {
//         const { unitPrice, quantity } = this.parent;
//         if (value == null || unitPrice == null || quantity == null) return true;
//         return value <= unitPrice * quantity;
//       }
//     )
//     .min(0, "Discount cannot be negative"),
//   unitPrice: Yup.number()
//     .transform((v, ov) => (ov === "" ? null : v))
//     .nullable()
//     .positive("Must be greater than 0"),
//   total: Yup.number(),
// });

// const columns = (
//   onUpdateItemQuantity: (orderId: number, itemId: number, body: any) => void,
//   onDeleteItem: (orderId: number, itemId: number) => void
// ) => [
//   {
//     label: "Action",
//     width: 25,
//     render: (row: Item) => (
//       <CustomIconButton
//         Icon={IndeterminateCheckBoxIcon}
//         color="error"
//         size="small"
//         onClick={() => onDeleteItem(row.orderId, row.id)}
//       />
//     ),
//   },
//   {
//     label: "Product",
//     width: 180,
//     render: (row: Item) => `${row.name} (${row.sku})`,
//   },
//   { id: "grams", label: "Grams", width: 50, align: "right" },
//   {
//     id: "quantity",
//     label: "Quantity",
//     width: 50,
//     align: "right",
//     render: (row: Item) => (
//       <>
//         <CustomIconButton
//           Icon={IndeterminateCheckBoxIcon}
//           size="small"
//           onClick={() =>
//             onUpdateItemQuantity(row.orderId, row.id, {
//               quantity: row.quantity + 1,
//             })
//           }
//         />
//         {row.quantity}
//         <CustomIconButton
//           Icon={AddBoxIcon}
//           size="small"
//           onClick={() =>
//             onUpdateItemQuantity(row.orderId, row.id, {
//               quantity: row.quantity + 1,
//             })
//           }
//         />
//       </>
//     ),
//   },
//   { id: "discount", label: "Discount", width: 50, align: "right" },
//   { id: "unitPrice", label: "Price", width: 50, align: "right" },
//   {
//     label: "Total",
//     width: 50,
//     align: "right",
//     render: (row: Item) => row.unitPrice * row.quantity - row.discount,
//   },
// ];

// const items = [
//   {
//     id: 1,
//     name: "JOINT ON 50 ML",
//     unitPrice: 2000,
//     grams: 10,
//     sku: "JNT-50",
//     productId: null,
//     variantId: null,
//   },
//   {
//     id: 2,
//     name: "JOINT ON 20 ML",
//     unitPrice: 1500,
//     grams: 20,
//     sku: "JNT-20",
//     productId: null,
//     variantId: null,
//   },
//   {
//     id: 3,
//     name: "FLEX ON 20 ML",
//     unitPrice: 2500,
//     grams: 30,
//     sku: "FLX-50",
//     productId: null,
//     variantId: null,
//   },
// ];

// type TItemForm = Omit<Item, "orderId" | "discount"> & {
//   total: number;
//   discount: number;
// };

// export default function ItemsTable({ orderId }: { orderId: number }) {
//   const order = useSelector(selectOrderById(orderId));
//   const [posttItem, { isLoading }] = useCreateOrderItemMutation();
//   const [updateItem, { isLoading: isUpdatingItem }] =
//     useUpdateOrderItemMutation();
//   const [deleteItem, { isLoading: isDeletingItem }] =
//     useDeleteOrderItemMutation();

//   const {
//     control,
//     reset,
//     handleSubmit,
//     setValue,
//     watch,
//     clearErrors,
//     setError,
//     formState: { errors },
//   } = useForm<TItemForm>({
//     resolver: yupResolver(schema),
//   });

//   const [discount, quantity, unitPrice] = watch([
//     "discount",
//     "quantity",
//     "unitPrice",
//   ]);

//   useEffect(() => {
//     let total: number = 0;
//     if (unitPrice) total = unitPrice * quantity;
//     if (unitPrice && discount) total -= discount;
//     setValue("total", total, {
//       shouldTouch: true,
//     });
//     clearErrors(["total", "quantity"]);
//   }, [discount, quantity, unitPrice]);

//   const onSubmit = async (body: TItemForm) => {
//     posttItem({ orderId, body })
//       .unwrap()
//       .then(() => {})
//       .catch((error) => setError("root", { message: getErrorMessage(error) }));
//   };

//   const onDeleteItem = (orderId: number, itemId: number) =>
//     deleteItem({ orderId, itemId }).unwrap();

//   const onUpdateItemQuantity = (orderId: number, itemId: number, body: any) =>
//     updateItem({ orderId, itemId, body }).unwrap();

//   return (
//     <Box
//       sx={{
//         minHeight: 250,
//         display: "flex",
//         flex: 1,
//         flexDirection: "column",
//         justifyContent: "space-between",
//       }}
//     >
//       <CustomTable
//         rowIdKey="id"
//         columns={columns(onUpdateItemQuantity, onDeleteItem)}
//         rows={order?.items || []}
//       />
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "row",
//           alignItems: "flex-end",
//           gap: 1,
//           py: 1,
//         }}
//       >
//         <Box sx={{ flexBasis: "300%" }}>
//           <FormAutocomplete
//             label="Select Item"
//             placeholder="Select Item"
//             name="name"
//             options={items}
//             control={control}
//             isOptionEqualToValue={(option, value) => option.id === value.id}
//             getOptionLabel={(option) => option.name ?? ""}
//             onChange={(e, value) => {
//               clearErrors(["name"]);
//               Object.keys(value || items[0]).forEach((k) =>
//                 setValue(k, value && k in value ? value[k] : "", {
//                   shouldTouch: true,
//                 })
//               );
//             }}
//           />
//         </Box>
//         <FormInputText
//           label="Quantity"
//           name="quantity"
//           type="number"
//           control={control}
//         />
//         <FormInputText
//           label="Discount"
//           name="discount"
//           type="number"
//           control={control}
//         />
//         <FormInputText
//           label="Unit Price"
//           name="unitPrice"
//           type="number"
//           control={control}
//           disabled
//         />
//         <FormInputText
//           label="Total"
//           name="total"
//           type="number"
//           control={control}
//           disabled
//         />
//         <FormRootError errors={errors} />
//         <CustomIconButton
//           Icon={AddBoxIcon}
//           size="large"
//           loading={isLoading}
//           onClick={handleSubmit(onSubmit)}
//         />
//       </Box>
//     </Box>
//   );
// }

import { useEffect, useMemo, useCallback } from "react";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import CustomTable from "@/components/CustomTable";
import CustomIconButton from "@/components/IconButton";
import FormAutocomplete from "@/components/form/FormAutocomplete";
import { FormInputText } from "@/components/form/FormInput";
import FormRootError from "@/components/form/FormRootError";
import { getErrorMessage } from "@/utils";
import {
  selectOrderById,
  useCreateOrderItemMutation,
  useDeleteOrderItemMutation,
  useUpdateOrderItemMutation,
} from "@/api/orders";
import { useSelector } from "react-redux";
import type { Item } from "@/types/orders/detail";

const schema = Yup.object({
  name: Yup.string(),
  sku: Yup.string(),
  productId: Yup.string().nullable(),
  variantId: Yup.string().nullable(),
  grams: Yup.number()
    .transform((v, ov) => (ov === "" ? null : v))
    .nullable(),
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
      "Discount cannot exceed unit price × quantity",
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

const mockItems = [
  { id: 1, name: "JOINT ON 50 ML", unitPrice: 2000, grams: 10, sku: "JNT-50" },
  { id: 2, name: "JOINT ON 20 ML", unitPrice: 1500, grams: 20, sku: "JNT-20" },
  { id: 3, name: "FLEX ON 20 ML", unitPrice: 2500, grams: 30, sku: "FLX-50" },
];

type TItemForm = Omit<Item, "orderId" | "discount"> & {
  total: number;
  discount: number;
};

export default function ItemsTable({ orderId }: { orderId: number }) {
  const order = useSelector(selectOrderById(orderId));

  // RTK Query hooks
  const [createItem, { isLoading: isCreating }] = useCreateOrderItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateOrderItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteOrderItemMutation();

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<TItemForm>({ resolver: yupResolver(schema) });

  const [discount, quantity, unitPrice] = watch([
    "discount",
    "quantity",
    "unitPrice",
  ]);

  // --- calculate total dynamically
  useEffect(() => {
    const calculateTotal = (price = 0, qty = 0, disc = 0) =>
      price * qty - (disc || 0);

    if (unitPrice && quantity) {
      const total = calculateTotal(unitPrice, quantity, discount);
      setValue("total", total, { shouldTouch: true });
      clearErrors(["total", "quantity"]);
    }
  }, [discount, quantity, unitPrice, clearErrors, setValue]);

  // --- handlers
  const handleAddItem = useCallback(
    async (body: TItemForm) => {
      try {
        await createItem({ orderId, body }).unwrap();
        // reset();
      } catch (err) {
        setError("root", { message: getErrorMessage(err) });
      }
    },
    [createItem, orderId, reset, setError]
  );

  const handleDeleteItem = useCallback(
    async (orderId: number, itemId: number) => {
      await deleteItem({ orderId, itemId }).unwrap();
    },
    [deleteItem]
  );

  const handleUpdateItemQuantity = useCallback(
    async (orderId: number, itemId: number, quantity: number) => {
      await updateItem({ orderId, itemId, body: { quantity } }).unwrap();
    },
    [updateItem]
  );

  // --- memoized columns for CustomTable
  const tableColumns = useMemo(
    () => [
      {
        label: "Action",
        width: 25,
        render: (row: Item) => (
          <CustomIconButton
            Icon={IndeterminateCheckBoxIcon}
            color="error"
            size="small"
            onClick={() => handleDeleteItem(row.orderId, row.id)}
            loading={isDeleting}
          />
        ),
      },
      {
        label: "Product",
        width: 180,
        render: (row: Item) => `${row.name} (${row.sku})`,
      },
      { id: "grams", label: "Grams", width: 50, align: "right" },
      {
        id: "quantity",
        label: "Quantity",
        width: 100,
        align: "center",
        render: (row: Item) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            <CustomIconButton
              Icon={IndeterminateCheckBoxIcon}
              size="small"
              disabled={isUpdating}
              onClick={() =>
                handleUpdateItemQuantity(row.orderId, row.id, row.quantity - 1)
              }
            />
            {row.quantity}
            <CustomIconButton
              Icon={AddBoxIcon}
              size="small"
              disabled={isUpdating}
              onClick={() =>
                handleUpdateItemQuantity(row.orderId, row.id, row.quantity + 1)
              }
            />
          </Box>
        ),
      },
      { id: "discount", label: "Discount", width: 80, align: "right" },
      { id: "unitPrice", label: "Price", width: 80, align: "right" },
      {
        label: "Total",
        width: 100,
        align: "right",
        render: (row: Item) =>
          row.unitPrice * row.quantity - (row.discount || 0),
      },
    ],
    [handleDeleteItem, handleUpdateItemQuantity, isUpdating, isDeleting]
  );

  return (
    <Box
      sx={{
        minHeight: 250,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <CustomTable
        rowIdKey="id"
        columns={tableColumns}
        rows={order?.items || []}
      />

      {/* --- Add Item Form --- */}
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, py: 1 }}>
        <Box sx={{ flexBasis: "300%" }}>
          <FormAutocomplete
            label="Select Item"
            placeholder="Select Item"
            name="name"
            options={mockItems}
            control={control}
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            getOptionLabel={(opt) => opt?.name ?? ""}
            onChange={(e, value) => {
              clearErrors(["name"]);
              Object.entries(value || {}).forEach(([k, v]) =>
                setValue(k as keyof TItemForm, v as any, { shouldTouch: true })
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
          loading={isCreating}
          onClick={handleSubmit(handleAddItem)}
        />
      </Box>
    </Box>
  );
}
