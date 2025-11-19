import CustomDialog from "@/components/Dialog";
import type { ModalProps } from "@/types/common";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormInputText } from "@/components/form/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorField, getErrorMessage } from "@/utils";
import FormAutocomplete from "@/components/form/FormAutocomplete";
import { useCreateUserMutation } from "@/api/user";
import { useListAvailableIntegrationsQuery } from "@/api/courier";
import { FormInputTextArea } from "@/components/form/FormTextArea";

type CreateUpdateProductModalProps = ModalProps;

function CreateUpdateIntegrationForm({ control, errors }) {
  const {
    data: availableCourierIntegration,
    isLoading: isLoadingAvailableCourier,
  } = useListAvailableIntegrationsQuery({});
  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormAutocomplete
          options={
            availableCourierIntegration?.map(({ courier }) => courier) || []
          }
          loading={isLoadingAvailableCourier}
          control={control}
          getOptionValue={(value) => value.id}
          setValue={(value, options) => options.find((opt) => opt.id === value)}
          label="Select Courier"
          name="courier"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormInputText
          autoFocus
          control={control}
          label="Account Name"
          name="name"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <FormInputTextArea
          control={control}
          label="Pickup Address"
          name="pickupAddress"
          minRows={5}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <FormInputTextArea
          control={control}
          label="Return Address"
          name="returnAddress"
          minRows={5}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormRootError errors={errors} />
      </Grid>
    </Grid>
  );
}

const schema = Yup.object({
  name: Yup.string().required("Account name is required"),
  courier: Yup.number().required("Please select courier service"),
  pickupAddress: Yup.string().nullable(),
  returnAddress: Yup.string().nullable(),
});

const defaultValues = {
  name: null,
  courier: null,
  pickupAddress: null,
  returnAddress: null,
};

export default function CreateUpdateIntegrationModal({
  open,
  setOpen,
}: CreateUpdateProductModalProps) {
  const [createUser, { isLoading }] = useCreateUserMutation();
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
    return createUser(data)
      .unwrap()
      .then(() => setOpen(false))
      .catch((error) => {
        const message = getErrorMessage(error);
        setError(getErrorField(message, ["name", "courier"]), {
          message,
        });
      });
  });

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title="Create/Update Courier Account Integration"
      actions={[
        {
          label: "Integrate Courier",
          onClick: onSubmit,
          loading: isLoading,
        },
      ]}
      size="sm"
    >
      <CreateUpdateIntegrationForm control={control} errors={errors} />
    </CustomDialog>
  );
}
