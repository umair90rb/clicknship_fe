import CustomDialog from "@/components/Dialog";
import type { ModalProps } from "@/types/common";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormInputText } from "@/components/form/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorMessage } from "@/utils";
import { useCreateProductMutation } from "@/api/products";
import { FormInputTextArea } from "@/components/form/FormTextArea";
import FormAutocomplete from "@/components/form/FormAutocomplete";
import useCategoryBrandUnitList from "@/hooks/useCategoryBrandUnitList";
import { useMemo } from "react";

type CreateUpdateProductModalProps = ModalProps;

function CreateUpdateProductForm({ control, errors }) {
  const { unitList, brandList, categoryList } = useCategoryBrandUnitList();

  const units = useMemo(() => unitList.map(({ name }) => name), [unitList]);
  const brands = useMemo(
    () => brandList.map(({ id, name }) => ({ id, label: name })),
    [brandList]
  );
  const categories = useMemo(
    () => categoryList.map(({ id, name }) => ({ id, label: name })),
    [categoryList]
  );

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <FormInputText autoFocus control={control} label="Name" name="name" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <FormInputText control={control} label="SKU" name="sku" />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <FormInputText
          control={control}
          type="number"
          label="Price"
          name="unitPrice"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <FormInputText
          control={control}
          type="number"
          label="Cost Price"
          name="costPrice"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormAutocomplete
          options={units}
          control={control}
          label="Select Unit"
          name="unit"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormAutocomplete
          options={categories}
          control={control}
          getOptionValue={(value) => value.id}
          setValue={(value, options) => options.find((opt) => opt.id === value)}
          label="Select Category"
          name="categoryId"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormAutocomplete
          options={brands}
          control={control}
          getOptionValue={(value) => value.id}
          setValue={(value, options) => options.find((opt) => opt.id === value)}
          label="Select Brand"
          name="brandId"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormInputText
          control={control}
          type="number"
          label="Incentive"
          name="incentive"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormInputText
          control={control}
          type="number"
          label="Weight"
          name="weight"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormInputText control={control} label="Barcode" name="barcode" />
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormInputTextArea
          minRows={5}
          control={control}
          placeholder="Description"
          name="description"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormRootError errors={errors} />
      </Grid>
    </Grid>
  );
}

const schema = Yup.object({
  name: Yup.string().required("Product name is required"),
  description: Yup.string().nullable(),
  sku: Yup.string().required("Product SKU is required"),
  barcode: Yup.string().nullable(),
  unitPrice: Yup.number().min(1).required("Price is required"),
  costPrice: Yup.number().nullable(),
  incentive: Yup.number().nullable(),
  weight: Yup.number().nullable(),
  unit: Yup.string().nullable(),
  active: Yup.boolean().required(),
  categoryId: Yup.number().nullable(),
  brandId: Yup.number().nullable(),
});

const defaultValues = {
  name: null,
  sku: null,
  unitPrice: null,
  description: null,
  barcode: null,
  costPrice: null,
  incentive: null,
  weight: null,
  active: true,
  unit: null,
  categoryId: null,
  brandId: null,
};

export default function CreateUpdateProductModal({
  open,
  setOpen,
}: CreateUpdateProductModalProps) {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    return createProduct(data)
      .unwrap()
      .then(() => setOpen(false))
      .catch((error) => {
        const message = getErrorMessage(error);
        setError(message.includes("SKU") ? "sku" : "root", {
          message,
        });
      });
  });

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title="Create/Update Product"
      actions={[
        {
          label: "Add Product",
          onClick: onSubmit,
          loading: isLoading,
        },
      ]}
      size="md"
    >
      <CreateUpdateProductForm control={control} errors={errors} />
    </CustomDialog>
  );
}
