import CustomDialog from "@/components/Dialog";
import type { ModalProps } from "@/types/common";
import { Grid } from "@mui/material";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { FormInputText } from "@/components/form/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorField, getErrorMessage } from "@/utils";
import FormAutocomplete from "@/components/form/FormAutocomplete";
import {
  useCreateIntegrationMutation,
  useListAvailableIntegrationsQuery,
} from "@/api/courier";
import { FormInputTextArea } from "@/components/form/FormTextArea";
import { useEffect } from "react";

type CreateUpdateIntegrationModalProps = ModalProps;

const schema = Yup.object({
  name: Yup.string().required("Account name is required"),
  courier: Yup.string().required("Please select courier service"),
  dispatchAddress: Yup.string().nullable(),
  returnAddress: Yup.string().nullable(),
  fields: Yup.array().min(1),
});

const defaultValues = {
  name: null,
  courier: null,
  dispatchAddress: null,
  returnAddress: null,
};

export default function CreateUpdateIntegrationModal({
  open,
  setOpen,
}: CreateUpdateIntegrationModalProps) {
  const [addIntegration, { isLoading }] = useCreateIntegrationMutation();
  const {
    data: availableCourierIntegration,
    isLoading: isLoadingAvailableCourier,
  } = useListAvailableIntegrationsQuery({});
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "fields",
  });

  const courier = useWatch({ control, name: "courier" });

  useEffect(() => {
    console.log(courier, availableCourierIntegration);
    if (courier && availableCourierIntegration?.[courier]) {
      const requiredFields = availableCourierIntegration?.[courier]?.fields;
      console.log(requiredFields, courier);
      // Map required field names to objects for useFieldArray
      const newFields = availableCourierIntegration?.[courier]?.fields?.map(
        (fieldName, index) => ({
          name: fieldName,
          value: "",
        })
      );
      console.log(newFields);
      replace(newFields);
    } else {
      replace([]);
    }
  }, [courier, replace]);

  const onSubmit = handleSubmit(async (data) => {
    return addIntegration(data)
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
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <FormAutocomplete
            options={
              (availableCourierIntegration &&
                Object.keys(availableCourierIntegration).map((k) => ({
                  label: availableCourierIntegration[k].name,
                  id: k,
                }))) ||
              []
            }
            control={control}
            getOptionValue={(value) => value.id}
            setValue={(value, options) =>
              options.find((opt) => opt.id === value)
            }
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

        {fields.map((field, index) => (
          <FormInputText
            key={field.id}
            control={control}
            name={`fields.${index}.value`}
            label={field.name}
          />
        ))}

        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <FormInputTextArea
            control={control}
            label="Dispatch Address"
            name="dispatchAddress"
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
    </CustomDialog>
  );
}
