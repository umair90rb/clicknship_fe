import CustomDialog from "@/components/Dialog";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormInputText } from "@/components/form/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorMessage } from "@/utils";
import {
  useCreateInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useListLocationsQuery,
} from "@/api/inventory";
import { useListProductQuery } from "@/api/products";
import type { InventoryItem } from "@/types/inventory";
import type { Product } from "@/types/products";
import { useEffect, useMemo } from "react";
import FormAutocomplete from "@/components/form/FormAutocomplete";

interface CreateUpdateInventoryItemModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  item: InventoryItem | null;
}

const schema = Yup.object({
  productId: Yup.number().nullable().default(null),
  locationId: Yup.number().nullable().default(null),
  quantity: Yup.number().min(0, "Quantity must be 0 or greater").nullable().default(0),
  reorderPoint: Yup.number().min(0, "Must be 0 or greater").nullable().default(null),
  reorderQuantity: Yup.number().min(0, "Must be 0 or greater").nullable().default(null),
  costPrice: Yup.number().min(0, "Must be 0 or greater").nullable().default(null),
});

type FormData = Yup.InferType<typeof schema>;

const defaultValues: FormData = {
  productId: null,
  locationId: null,
  quantity: 0,
  reorderPoint: null,
  reorderQuantity: null,
  costPrice: null,
};

export default function CreateUpdateInventoryItemModal({
  open,
  setOpen,
  item,
}: CreateUpdateInventoryItemModalProps) {
  const isEditing = Boolean(item);
  const [createItem, { isLoading: isCreating }] =
    useCreateInventoryItemMutation();
  const [updateItem, { isLoading: isUpdating }] =
    useUpdateInventoryItemMutation();

  const { data: locationsData } = useListLocationsQuery();
  const { data: productsData } = useListProductQuery({ take: 1000 });

  const locations = useMemo(
    () =>
      locationsData?.data?.map(({ id, name }) => ({ id, label: name })) || [],
    [locationsData]
  );

  const products = useMemo(
    () =>
      productsData?.data?.map((p: Product) => ({
        id: p.id,
        label: `${p.name} (${p.sku})`,
      })) || [],
    [productsData]
  );

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      if (item) {
        reset({
          productId: item.productId,
          locationId: item.locationId,
          quantity: item.quantity,
          reorderPoint: item.reorderPoint,
          reorderQuantity: item.reorderQuantity,
          costPrice: item.costPrice,
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [open, item, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEditing && item) {
        await updateItem({
          id: item.id,
          body: {
            reorderPoint: data.reorderPoint ?? undefined,
            reorderQuantity: data.reorderQuantity ?? undefined,
            costPrice: data.costPrice ?? undefined,
          },
        }).unwrap();
      } else {
        if (!data.productId) {
          setError("productId", { message: "Product is required" });
          return;
        }
        await createItem({
          productId: data.productId,
          locationId: data.locationId ?? undefined,
          quantity: data.quantity ?? 0,
          reorderPoint: data.reorderPoint ?? undefined,
          reorderQuantity: data.reorderQuantity ?? undefined,
          costPrice: data.costPrice ?? undefined,
        }).unwrap();
      }
      setOpen(false);
    } catch (error) {
      const message = getErrorMessage(error);
      setError("root", { message });
    }
  });

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title={isEditing ? "Edit Inventory Item" : "Add Inventory Item"}
      actions={[
        {
          label: isEditing ? "Update" : "Add Item",
          onClick: onSubmit,
          loading: isCreating || isUpdating,
        },
      ]}
      size="md"
    >
      <Grid container spacing={2}>
        {!isEditing && (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormAutocomplete
                options={products}
                control={control}
                label="Product"
                name="productId"
                getOptionLabel={(opt) => opt?.label || ""}
                getOptionValue={(opt) => opt?.id}
                setValue={(value, options) =>
                  options.find((opt) => opt.id === value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormAutocomplete
                options={locations}
                control={control}
                label="Location"
                name="locationId"
                getOptionLabel={(opt) => opt?.label || ""}
                getOptionValue={(opt) => opt?.id}
                setValue={(value, options) =>
                  options.find((opt) => opt.id === value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormInputText
                control={control}
                type="number"
                label="Initial Quantity"
                name="quantity"
              />
            </Grid>
          </>
        )}
        {isEditing && (
          <Grid size={{ xs: 12 }}>
            <FormInputText
              control={control}
              label="Product"
              name="productId"
              disabled
              helperText={`${item?.product?.name} (${item?.product?.sku})`}
            />
          </Grid>
        )}
        <Grid size={{ xs: 12, sm: isEditing ? 4 : 6 }}>
          <FormInputText
            control={control}
            type="number"
            label="Reorder Point"
            name="reorderPoint"
            placeholder="Optional"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: isEditing ? 4 : 6 }}>
          <FormInputText
            control={control}
            type="number"
            label="Reorder Quantity"
            name="reorderQuantity"
            placeholder="Optional"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: isEditing ? 4 : 6 }}>
          <FormInputText
            control={control}
            type="number"
            label="Cost Price"
            name="costPrice"
            placeholder="Optional"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormRootError errors={errors} />
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
