import CustomDialog from "@/components/Dialog";
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { FormInputText } from "@/components/form/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorMessage } from "@/utils";
import {
  useCreateTransferMutation,
  useListLocationsQuery,
} from "@/api/inventory";
import { useListProductQuery } from "@/api/products";
import type { Product } from "@/types/products";
import { useEffect, useMemo } from "react";
import FormAutocomplete from "@/components/form/FormAutocomplete";
import { FormInputTextArea } from "@/components/form/FormTextArea";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PrimaryButton from "@/components/Button";

interface CreateTransferModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
}

const itemSchema = Yup.object({
  productId: Yup.number().required("Product is required"),
  quantity: Yup.number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
});

const schema = Yup.object({
  fromLocationId: Yup.number().required("Source location is required"),
  toLocationId: Yup.number()
    .required("Destination location is required")
    .test(
      "not-same",
      "Destination must be different from source",
      function (value) {
        return value !== this.parent.fromLocationId;
      }
    ),
  notes: Yup.string().nullable(),
  items: Yup.array().of(itemSchema).min(1, "At least one item is required"),
});

const defaultValues = {
  fromLocationId: null as unknown as number,
  toLocationId: null as unknown as number,
  notes: "",
  items: [
    {
      productId: null as unknown as number,
      quantity: 1,
    },
  ],
};

export default function CreateTransferModal({
  open,
  setOpen,
}: CreateTransferModalProps) {
  const [createTransfer, { isLoading }] = useCreateTransferMutation();

  const { data: locationsData } = useListLocationsQuery();
  const { data: productsData } = useListProductQuery({ take: 1000 });

  const locations = useMemo(
    () =>
      locationsData?.data?.map(({ id, name }) => ({ id, label: name })) || [],
    [locationsData]
  );

  const products = useMemo(
    () =>
      productsData?.data?.map((p: Product) => ({
        id: p.id,
        label: `${p.name} (${p.sku})`,
      })) || [],
    [productsData]
  );

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createTransfer({
        fromLocationId: data.fromLocationId,
        toLocationId: data.toLocationId,
        notes: data.notes ?? undefined,
        items: data.items!.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }).unwrap();
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
      title="Create Stock Transfer"
      actions={[
        {
          label: "Create Transfer",
          onClick: onSubmit,
          loading: isLoading,
        },
      ]}
      size="lg"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormAutocomplete
            options={locations}
            control={control}
            label="From Location"
            name="fromLocationId"
            getOptionLabel={(opt) => opt?.label || ""}
            getOptionValue={(opt) => opt?.id}
            setValue={(value, options) =>
              options.find((opt) => opt.id === value)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormAutocomplete
            options={locations}
            control={control}
            label="To Location"
            name="toLocationId"
            getOptionLabel={(opt) => opt?.label || ""}
            getOptionValue={(opt) => opt?.id}
            setValue={(value, options) =>
              options.find((opt) => opt.id === value)
            }
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Items to Transfer
            </Typography>
            <PrimaryButton
              label="Add Item"
              Icon={AddIcon}
              variant="outlined"
              onClick={() =>
                append({
                  productId: null as unknown as number,
                  quantity: 1,
                })
              }
            />
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell width={150}>Quantity</TableCell>
                  <TableCell width={50}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormAutocomplete
                        options={products}
                        control={control}
                        label=""
                        name={`items.${index}.productId`}
                        getOptionLabel={(opt) => opt?.label || ""}
                        getOptionValue={(opt) => opt?.id}
                        setValue={(value, options) =>
                          options.find((opt) => opt.id === value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <FormInputText
                        control={control}
                        type="number"
                        label=""
                        name={`items.${index}.quantity`}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormInputTextArea
            control={control}
            label="Notes"
            name="notes"
            placeholder="Optional notes"
            minRows={2}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormRootError errors={errors} />
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
