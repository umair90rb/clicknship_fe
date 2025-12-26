import CustomDialog from "@/components/Dialog";
import type { ModalProps } from "@/types/common";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorMessage } from "@/utils";
import { useCreateFeedbackMutation } from "@/api/support";
import { FormInputTextArea } from "@/components/form/FormTextArea";
import { FormRating } from "@/components/form/FormRating";
import { FormSelect } from "@/components/form/FormSelect";
import { FeedbackCategory, type CreateFeedbackDto } from "@/types/support";

const categoryOptions = [
  { label: "Feature", value: FeedbackCategory.feature },
  { label: "Module", value: FeedbackCategory.module },
  { label: "General", value: FeedbackCategory.general },
  { label: "UI/UX", value: FeedbackCategory.ui_ux },
  { label: "Performance", value: FeedbackCategory.performance },
];

const schema = Yup.object({
  stars: Yup.number().min(1, "Rating is required").required("Rating is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
});

const defaultValues = {
  stars: 0,
  description: "",
  category: FeedbackCategory.general,
};

interface CreateFeedbackModalProps extends ModalProps {}

export default function CreateFeedbackModal({
  open,
  setOpen,
}: CreateFeedbackModalProps) {
  const [createFeedback, { isLoading }] = useCreateFeedbackMutation();
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
    return createFeedback(data as CreateFeedbackDto)
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
      title="Submit Feedback"
      actions={[
        {
          label: "Submit Feedback",
          onClick: onSubmit,
          loading: isLoading,
        },
      ]}
      size="sm"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormRating control={control} label="Rating" name="stars" />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormSelect
            control={control}
            label="Category"
            name="category"
            options={categoryOptions}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormInputTextArea
            control={control}
            label="Description"
            name="description"
            placeholder="Tell us about your experience..."
            minRows={4}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormRootError errors={errors} />
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
