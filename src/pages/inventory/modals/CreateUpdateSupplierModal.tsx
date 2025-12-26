import CustomDialog from "@/components/Dialog";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormInputText } from "@/components/form/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorMessage } from "@/utils";
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from "@/api/inventory";
import type { Supplier } from "@/types/inventory";
import { useEffect } from "react";
import FormInputSingleCheckbox from "@/components/form/FormSingleCheckbox";

interface CreateUpdateSupplierModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  supplier: Supplier | null;
}

const schema = Yup.object({
  name: Yup.string().required("Supplier name is required"),
  contactName: Yup.string().nullable().default(""),
  email: Yup.string().email("Invalid email format").nullable().default(""),
  phone: Yup.string().nullable().default(""),
  address: Yup.string().nullable().default(""),
  active: Yup.boolean().default(true),
});

type FormData = Yup.InferType<typeof schema>;

const defaultValues: FormData = {
  name: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  active: true,
};

export default function CreateUpdateSupplierModal({
  open,
  setOpen,
  supplier,
}: CreateUpdateSupplierModalProps) {
  const isEditing = Boolean(supplier);
  const [createSupplier, { isLoading: isCreating }] =
    useCreateSupplierMutation();
  const [updateSupplier, { isLoading: isUpdating }] =
    useUpdateSupplierMutation();

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
      if (supplier) {
        reset({
          name: supplier.name,
          contactName: supplier.contactName || "",
          email: supplier.email || "",
          phone: supplier.phone || "",
          address: supplier.address || "",
          active: supplier.active,
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [open, supplier, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEditing && supplier) {
        await updateSupplier({
          id: supplier.id,
          body: {
            name: data.name,
            contactName: data.contactName || undefined,
            email: data.email || undefined,
            phone: data.phone || undefined,
            address: data.address || undefined,
            active: data.active,
          },
        }).unwrap();
      } else {
        await createSupplier({
          name: data.name,
          contactName: data.contactName || undefined,
          email: data.email || undefined,
          phone: data.phone || undefined,
          address: data.address || undefined,
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
      title={isEditing ? "Edit Supplier" : "Add Supplier"}
      actions={[
        {
          label: isEditing ? "Update" : "Add Supplier",
          onClick: onSubmit,
          loading: isCreating || isUpdating,
        },
      ]}
      size="md"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormInputText
            autoFocus
            control={control}
            label="Supplier Name"
            name="name"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormInputText
            control={control}
            label="Contact Person"
            name="contactName"
            placeholder="Optional"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormInputText
            control={control}
            label="Email"
            name="email"
            type="email"
            placeholder="Optional"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormInputText
            control={control}
            label="Phone"
            name="phone"
            placeholder="Optional"
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
        {isEditing && (
          <Grid size={{ xs: 12 }}>
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
