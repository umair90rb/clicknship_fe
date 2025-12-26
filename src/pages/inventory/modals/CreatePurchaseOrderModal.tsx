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
  useCreatePurchaseOrderMutation,
  useListSuppliersQuery,
  useListLocationsQuery,
} from "@/api/inventory";
import { useListProductQuery } from "@/api/products";
import type { Product } from "@/types/products";
import { useEffect, useMemo } from "react";
import FormAutocomplete from "@/components/form/FormAutocomplete";
import { FormInputDate } from "@/components/form/FormDatePicker";
import { FormInputTextArea } from "@/components/form/FormTextArea";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PrimaryButton from "@/components/Button";
import { formatCurrency } from "../utils";

interface CreatePurchaseOrderModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
}

interface ProductOption {
  id: number;
  label: string;
  costPrice: number;
}

const itemSchema = Yup.object({
  productId: Yup.number().required("Product is required"),
  orderedQuantity: Yup.number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
  unitCost: Yup.number()
    .min(0, "Cost must be 0 or greater")
    .required("Unit cost is required"),
  locationId: Yup.number().nullable(),
});

const schema = Yup.object({
  supplierId: Yup.number().nullable(),
  orderDate: Yup.string().nullable(),
  expectedDate: Yup.string().nullable(),
  notes: Yup.string().nullable(),
  items: Yup.array().of(itemSchema).min(1, "At least one item is required"),
});

const defaultValues = {
  supplierId: null as number | null,
  orderDate: null as string | null,
  expectedDate: null as string | null,
  notes: "",
  items: [
    {
      productId: null as unknown as number,
      orderedQuantity: 1,
      unitCost: 0,
      locationId: null as number | null,
    },
  ],
};

export default function CreatePurchaseOrderModal({
  open,
  setOpen,
}: CreatePurchaseOrderModalProps) {
  const [createPO, { isLoading }] = useCreatePurchaseOrderMutation();

  const { data: suppliersData } = useListSuppliersQuery();
  const { data: locationsData } = useListLocationsQuery();
  const { data: productsData } = useListProductQuery({ take: 1000 });

  const suppliers = useMemo(
    () =>
      suppliersData?.data?.map(({ id, name }) => ({ id, label: name })) || [],
    [suppliersData]
  );

  const locations = useMemo(
    () =>
      locationsData?.data?.map(({ id, name }) => ({ id, label: name })) || [],
    [locationsData]
  );

  const products = useMemo<ProductOption[]>(
    () =>
      productsData?.data?.map((p: Product) => ({
        id: p.id,
        label: `${p.name} (${p.sku})`,
        costPrice: p.costPrice || 0,
      })) || [],
    [productsData]
  );

  const {
    control,
    handleSubmit,
    setError,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  const totalAmount = useMemo(() => {
    return (watchItems || []).reduce((sum, item) => {
      return sum + (item.orderedQuantity || 0) * (item.unitCost || 0);
    }, 0);
  }, [watchItems]);

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const handleProductChange = (index: number, productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setValue(`items.${index}.unitCost`, product.costPrice);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createPO({
        supplierId: data.supplierId ?? undefined,
        orderDate: data.orderDate ?? undefined,
        expectedDate: data.expectedDate ?? undefined,
        notes: data.notes ?? undefined,
        items: data.items!.map((item) => ({
          productId: item.productId,
          orderedQuantity: item.orderedQuantity,
          unitCost: item.unitCost,
          locationId: item.locationId ?? undefined,
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
      title="Create Purchase Order"
      actions={[
        {
          label: "Create PO",
          onClick: onSubmit,
          loading: isLoading,
        },
      ]}
      size="lg"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormAutocomplete
            options={suppliers}
            control={control}
            label="Supplier"
            name="supplierId"
            getOptionLabel={(opt) => opt?.label || ""}
            getOptionValue={(opt) => opt?.id}
            setValue={(value, options) =>
              options.find((opt) => opt.id === value)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormInputDate control={control} label="Order Date" name="orderDate" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormInputDate
            control={control}
            label="Expected Date"
            name="expectedDate"
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
              Line Items
            </Typography>
            <PrimaryButton
              label="Add Item"
              Icon={AddIcon}
              variant="outlined"
              onClick={() =>
                append({
                  productId: null as unknown as number,
                  orderedQuantity: 1,
                  unitCost: 0,
                  locationId: null,
                })
              }
            />
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell width={100}>Quantity</TableCell>
                  <TableCell width={120}>Unit Cost</TableCell>
                  <TableCell width={120}>Line Total</TableCell>
                  <TableCell width={50}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => {
                  const item = watchItems?.[index];
                  const lineTotal =
                    (item?.orderedQuantity || 0) * (item?.unitCost || 0);
                  return (
                    <TableRow key={field.id}>
                      <TableCell>
                        <FormAutocomplete
                          options={products}
                          control={control}
                          label=""
                          name={`items.${index}.productId`}
                          getOptionLabel={(opt) => opt?.label || ""}
                          getOptionValue={(opt) => {
                            if (opt?.id) {
                              handleProductChange(index, opt.id);
                            }
                            return opt?.id;
                          }}
                          setValue={(value, options) =>
                            options.find((opt) => opt.id === value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormAutocomplete
                          options={locations}
                          control={control}
                          label=""
                          name={`items.${index}.locationId`}
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
                          name={`items.${index}.orderedQuantity`}
                        />
                      </TableCell>
                      <TableCell>
                        <FormInputText
                          control={control}
                          type="number"
                          label=""
                          name={`items.${index}.unitCost`}
                        />
                      </TableCell>
                      <TableCell>{formatCurrency(lineTotal)}</TableCell>
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
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Typography variant="h6">
              Total: {formatCurrency(totalAmount)}
            </Typography>
          </Box>
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
