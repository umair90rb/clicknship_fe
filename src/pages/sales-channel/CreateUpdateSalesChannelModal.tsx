import CustomDialog from "@/components/Dialog";
import type { ModalProps } from "@/types/common";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormInputText } from "@/components/form/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorMessage } from "@/utils";
import FormAutocomplete from "@/components/form/FormAutocomplete";
import useCategoryBrandUnitList from "@/hooks/useCategoryBrandUnitList";
import { useMemo } from "react";
import FormToggleButtons from "@/components/form/FormToggleButtons";
import { useCreateSalesChannelMutation } from "@/api/channel";

type CreateUpdateSalesChannelModalProps = ModalProps;

function CreateUpdateSalesChannelForm({ control, errors }) {
  const { brandList } = useCategoryBrandUnitList();

  const brands = useMemo(
    () => brandList.map(({ id, name }) => ({ id, label: name })),
    [brandList]
  );

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormInputText autoFocus control={control} label="Name" name="name" />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        {/* <FormInputText control={control} label="Type" name="type" /> */}
        <FormToggleButtons
          options={["Shopify", "Whatsapp", "Email", "Other"]}
          control={control}
          name="type"
          label=""
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormInputText
          control={control}
          label="Source"
          name="source"
          helperText="For type shopify, get this source from your shopify admin dashboard, https://admin.shopify.com/store/ali123 from this link ali123 is source"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormAutocomplete
          options={brands}
          control={control}
          getOptionValue={(value) => value.id}
          setValue={(value, options) => options.find((opt) => opt.id === value)}
          label="Select Brand"
          name="brandId"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormRootError errors={errors} />
      </Grid>
    </Grid>
  );
}

const schema = Yup.object({
  name: Yup.string().required("Name is required"),
  type: Yup.string().required("Type is required"),
  source: Yup.string().when("type", ([type], schema) => {
    return type === "Shopify"
      ? schema.required("Source is required for Shopify channels")
      : schema.notRequired();
  }),
  brandId: Yup.number().nullable(),
  active: Yup.boolean().required(),
});

const defaultValues = {
  name: null,
  type: null,
  source: null,
  brandId: null,
  active: true,
};

export default function CreateUpdateSalesChannelModal({
  open,
  setOpen,
}: CreateUpdateSalesChannelModalProps) {
  const [createSalesChannel, { isLoading }] = useCreateSalesChannelMutation();
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
    return createSalesChannel(data)
      .unwrap()
      .then(() => setOpen(false))
      .catch((error) => {
        const message = getErrorMessage(error);
        setError(message.includes("source") ? "source" : "root", {
          message,
        });
      });
  });

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title="Create/Update Sales Channel"
      actions={[
        {
          label: "Add Sales Channel",
          onClick: onSubmit,
          loading: isLoading,
        },
      ]}
      size="xs"
    >
      <CreateUpdateSalesChannelForm control={control} errors={errors} />
    </CustomDialog>
  );
}
