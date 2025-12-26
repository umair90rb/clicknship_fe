import CustomDialog from "@/components/Dialog";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormInputText } from "@/components/form/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorMessage } from "@/utils";
import {
  useCreateLocationMutation,
  useUpdateLocationMutation,
} from "@/api/inventory";
import type { InventoryLocation } from "@/types/inventory";
import { useEffect } from "react";
import FormInputSingleCheckbox from "@/components/form/FormSingleCheckbox";

interface CreateUpdateLocationModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  location: InventoryLocation | null;
}

const schema = Yup.object({
  name: Yup.string().required("Location name is required"),
  address: Yup.string().nullable().default(""),
  isDefault: Yup.boolean().default(false),
  active: Yup.boolean().default(true),
});

type FormData = Yup.InferType<typeof schema>;

const defaultValues: FormData = {
  name: "",
  address: "",
  isDefault: false,
  active: true,
};

export default function CreateUpdateLocationModal({
  open,
  setOpen,
  location,
}: CreateUpdateLocationModalProps) {
  const isEditing = Boolean(location);
  const [createLocation, { isLoading: isCreating }] =
    useCreateLocationMutation();
  const [updateLocation, { isLoading: isUpdating }] =
    useUpdateLocationMutation();

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
      if (location) {
        reset({
          name: location.name,
          address: location.address || "",
          isDefault: location.isDefault,
          active: location.active,
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [open, location, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEditing && location) {
        await updateLocation({
          id: location.id,
          body: {
            name: data.name,
            address: data.address || undefined,
            isDefault: data.isDefault,
            active: data.active,
          },
        }).unwrap();
      } else {
        await createLocation({
          name: data.name,
          address: data.address || undefined,
          isDefault: data.isDefault,
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
      title={isEditing ? "Edit Location" : "Add Location"}
      actions={[
        {
          label: isEditing ? "Update" : "Add Location",
          onClick: onSubmit,
          loading: isCreating || isUpdating,
        },
      ]}
      size="sm"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormInputText
            autoFocus
            control={control}
            label="Location Name"
            name="name"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormInputText
            control={control}
            label="Address"
            name="address"
            placeholder="Optional"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormInputSingleCheckbox
            control={control}
            label="Set as Default"
            name="isDefault"
          />
        </Grid>
        {isEditing && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormInputSingleCheckbox
              control={control}
              label="Active"
              name="active"
            />
          </Grid>
        )}
        <Grid size={{ xs: 12 }}>
          <FormRootError errors={errors} />
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
