import CustomDialog from "@/components/Dialog";
import type { ModalProps } from "@/types/common";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorMessage } from "@/utils";
import { useCreateFeatureRequestMutation } from "@/api/support";
import { FormInputText } from "@/components/form/FormInput";
import { FormInputTextArea } from "@/components/form/FormTextArea";

const schema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

const defaultValues = {
  title: "",
  description: "",
};

interface CreateFeatureRequestModalProps extends ModalProps {}

export default function CreateFeatureRequestModal({
  open,
  setOpen,
}: CreateFeatureRequestModalProps) {
  const [createFeatureRequest, { isLoading }] =
    useCreateFeatureRequestMutation();
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (data) => {
    return createFeatureRequest(data)
      .unwrap()
      .then(() => {
        reset();
        setOpen(false);
      })
      .catch((error) => {
        const message = getErrorMessage(error);
        setError("root", { message });
      });
  });

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title="Submit Feature Request"
      actions={[
        {
          label: "Submit Request",
          onClick: onSubmit,
          loading: isLoading,
        },
      ]}
      size="md"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormInputText
            autoFocus
            control={control}
            label="Title"
            name="title"
            placeholder="Brief summary of the feature"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormInputTextArea
            control={control}
            label="Description"
            name="description"
            placeholder="Describe the feature you'd like to see..."
            minRows={6}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormRootError errors={errors} />
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
