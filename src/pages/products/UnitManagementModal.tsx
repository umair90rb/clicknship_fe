import {
  useCreateUnitMutation,
  useDeleteUnitMutation,
  useListUnitQuery,
} from "@/api/unit";
import CustomDialog from "@/components/Dialog";
import type { ModalProps } from "@/types/common";
import type { Unit } from "@/types/units";
import { Chip, CircularProgress, Divider, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { FormInputText } from "@/components/form/FormInput";
import PrimaryButton from "@/components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorMessage } from "@/utils";
import Text from "@/components/Text";

type UnitManagementModalProps = ModalProps;

type UnitChipProps = Unit;

function UnitChip({ id, name }: UnitChipProps) {
  const [deleteUnit, { isLoading }] = useDeleteUnitMutation();
  return (
    <Chip
      sx={{ m: 0.3 }}
      label={name}
      variant="outlined"
      color="primary"
      onClick={() => {}}
      deleteIcon={isLoading ? <CircularProgress size={16} /> : <DeleteIcon />}
      onDelete={() => deleteUnit(id)}
    />
  );
}

const schema = Yup.object({
  name: Yup.string().required("unit name is required"),
  description: Yup.string().nullable(),
});

function CreateUnitForm() {
  const [createUnit, { isLoading }] = useCreateUnitMutation();
  const {
    control,
    handleSubmit,
    setError,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = handleSubmit(async (data) =>
    createUnit(data)
      .unwrap()
      .then(() => {
        reset();
        setTimeout(() => setFocus("name"), 100);
      })
      .catch((error) => {
        const message = getErrorMessage(error);
        setError(message.includes("name") ? "name" : "root", {
          message,
        });
      })
  );

  return (
    <>
      <Grid spacing={1} container m={1}>
        <Grid>
          <FormInputText autoFocus control={control} label="Name" name="name" />
        </Grid>
        <Grid size="grow">
          <FormInputText
            control={control}
            label="Description"
            name="description"
          />
        </Grid>
        <Grid alignContent={"center"}>
          <PrimaryButton
            label="Add Unit"
            onClick={onSubmit}
            loading={isLoading}
          />
        </Grid>
      </Grid>
      <FormRootError errors={errors} />
    </>
  );
}

export default function UnitManagementModal({
  open,
  setOpen,
}: UnitManagementModalProps) {
  const { data, isFetching, error } = useListUnitQuery({});

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      loading={isFetching}
      title="Manage Units"
      size="md"
    >
      {error && <Text color="error" text={getErrorMessage(error)} />}
      {data?.map((u) => (
        <UnitChip {...u} />
      ))}
      <Divider>Add New Unit</Divider>
      <CreateUnitForm />
    </CustomDialog>
  );
}
