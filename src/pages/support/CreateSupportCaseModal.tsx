import CustomDialog from "@/components/Dialog";
import type { ModalProps } from "@/types/common";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorMessage } from "@/utils";
import { useCreateSupportCaseMutation } from "@/api/support";
import { FormInputText } from "@/components/form/FormInput";
import { FormInputTextArea } from "@/components/form/FormTextArea";
import { FormSelect } from "@/components/form/FormSelect";
import { SupportCasePriority, type CreateSupportCaseDto } from "@/types/support";

const priorityOptions = [
  { label: "Low", value: SupportCasePriority.low },
  { label: "Medium", value: SupportCasePriority.medium },
  { label: "High", value: SupportCasePriority.high },
  { label: "Critical", value: SupportCasePriority.critical },
];

const schema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  priority: Yup.string().required("Priority is required"),
});

const defaultValues = {
  title: "",
  description: "",
  priority: SupportCasePriority.medium,
};

interface CreateSupportCaseModalProps extends ModalProps {}

export default function CreateSupportCaseModal({
  open,
  setOpen,
}: CreateSupportCaseModalProps) {
  const [createSupportCase, { isLoading }] = useCreateSupportCaseMutation();
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
    return createSupportCase(data as CreateSupportCaseDto)
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
      title="Create Support Case"
      actions={[
        {
          label: "Create Case",
          onClick: onSubmit,
          loading: isLoading,
        },
      ]}
      size="md"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <FormInputText
            autoFocus
            control={control}
            label="Title"
            name="title"
            placeholder="Brief summary of your issue"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormSelect
            control={control}
            label="Priority"
            name="priority"
            options={priorityOptions}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormInputTextArea
            control={control}
            label="Description"
            name="description"
            placeholder="Describe your issue in detail..."
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
