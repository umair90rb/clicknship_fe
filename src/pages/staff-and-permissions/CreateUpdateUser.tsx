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
import { useListRoleQuery } from "@/api/role";

type CreateUpdateProductModalProps = ModalProps;

function CreateUpdateUserForm({ control, errors }) {
  const { data: roleList, isLoading: isRoleLoading } = useListRoleQuery({});
  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormInputText autoFocus control={control} label="Name" name="name" />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormInputText control={control} label="Phone" name="phone" />
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormInputText control={control} label="Email" name="email" />
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormInputText control={control} label="Password" name="password" />
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormAutocomplete
          options={roleList?.map(({ id, name }) => ({ id, label: name })) || []}
          loading={isRoleLoading}
          control={control}
          getOptionValue={(value) => value.id}
          setValue={(value, options) => options.find((opt) => opt.id === value)}
          label="Select Role"
          name="roleId"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormRootError errors={errors} />
      </Grid>
    </Grid>
  );
}

const schema = Yup.object({
  name: Yup.string().required("User name is required"),
  phone: Yup.string().required("User phone is required"),
  email: Yup.string().email().required("User email is required"),
  password: Yup.string()
    .required("User password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long."
    ),
  roleId: Yup.number().required("Please select user role"),
});

const defaultValues = {
  name: null,
  phone: null,
  email: null,
  password: null,
  roleId: null,
};

export default function CreateUpdateUserModal({
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
        setError(
          getErrorField(message, [
            "name",
            "phone",
            "email",
            "password",
            "roleId",
          ]),
          {
            message,
          }
        );
      });
  });

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title="Create/Update Staff Account"
      actions={[
        {
          label: "Add Account",
          onClick: onSubmit,
          loading: isLoading,
        },
      ]}
      size="xs"
    >
      <CreateUpdateUserForm control={control} errors={errors} />
    </CustomDialog>
  );
}
