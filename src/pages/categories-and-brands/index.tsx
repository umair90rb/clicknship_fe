import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useEffect, useMemo } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TopToolbar from "@/components/data-table/TopToolbar";
import BottomToolbar from "@/components/data-table/BottomToolbar";
import useDrawer from "@/hooks/useDrawer";
import CustomIconButton from "@/components/IconButton";
import {
  useCreateBrandMutation,
  useCreateCategoryMutation,
  useDeleteBrandMutation,
  useDeleteCategoryMutation,
  useLazyListBrandQuery,
  useLazyListCategoryQuery,
} from "@/api/categoryAndBrands";
import type { Category } from "@/types/categoryAndBrands";
import { Box, Card, CardActions, CardHeader, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormInputText } from "@/components/form/FormInput";
import PrimaryButton from "@/components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorMessage } from "@/utils";
import { FormInputTextArea } from "@/components/form/FormTextArea";
import FormSwitchButton from "@/components/form/FormSwitchButton";

const categoryValidationSchema = Yup.object({
  name: Yup.string().required("Category name is required"),
  description: Yup.string().nullable(),
});

// Category Table and Create Form

function CreateCategoryForm() {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const {
    control,
    handleSubmit,
    setError,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categoryValidationSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = handleSubmit(async (data) =>
    createCategory(data)
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
    <Card>
      <CardHeader
        title="Add New Category"
        slotProps={{
          title: { variant: "body1", fontWeight: "bold" },
        }}
      />
      <Grid spacing={1} container m={1} flexDirection={"column"}>
        <Grid>
          <FormInputText control={control} label="Name" name="name" />
        </Grid>
        <Grid size="grow">
          <FormInputTextArea
            control={control}
            placeholder="Description (optional)"
            name="description"
            minRows={5}
          />
        </Grid>
        <Grid alignContent={"center"}></Grid>
      </Grid>
      <CardActions>
        <PrimaryButton
          fullWidth
          Icon={AddIcon}
          label="Add New Category"
          onClick={onSubmit}
          loading={isLoading}
        />
      </CardActions>
      <FormRootError errors={errors} />
    </Card>
  );
}

function CategoryTable() {
  const { drawerWidth, open } = useDrawer();

  const columns = useMemo<MRT_ColumnDef<Category>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Category Id",
        enableEditing: false,
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
      },
      {
        id: "description",
        accessorKey: "description",
        header: "Description",
      },
      {
        id: "productsCount",
        accessorKey: "_count.products",
        header: "Product Count",
        enableEditing: false,
      },
    ],
    []
  );

  const [fetchCategoriesList, { data, isFetching }] =
    useLazyListCategoryQuery();

  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();

  useEffect(() => {
    fetchCategoriesList({});
  }, []);

  const table = useMaterialReactTable({
    enableColumnFilters: false,
    paginationDisplayMode: "pages",
    enableSelectAll: false,
    enableStickyHeader: true,
    enableRowSelection: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableRowActions: true,
    enableKeyboardShortcuts: true,
    enableEditing: true,
    editDisplayMode: "modal",
    layoutMode: "semantic",
    muiTableContainerProps: {
      sx: {
        maxHeight: "50vh",
        height: "auto",
        width: "auto",
        maxWidth: `calc(100vw - ${open ? drawerWidth : 0}px)`,
      },
    },
    initialState: {
      density: "compact",
      columnVisibility: {
        description: false,
      },
      showGlobalFilter: true,
    },
    columns,
    data: data || [],
    manualPagination: false,
    autoResetPageIndex: false,
    state: { isLoading: isFetching },
    renderTopToolbar: (props) => (
      <TopToolbar
        hideFilterButton
        hideFullScreenButton
        title="Categories"
        {...props}
      />
    ),
    renderRowActions: ({ table, row }) => [
      <CustomIconButton
        Icon={DeleteIcon}
        color="error"
        onClick={() => deleteCategory(row.getValue<number>("id"))}
      />,
      // <CustomIconButton
      //   Icon={EditIcon}
      //   onClick={() => table.setEditingRow(row)}
      // />,
    ],
    renderBottomToolbar: (props) => <BottomToolbar {...props} />,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
}

// Brand Table and Create Form

const brandValidationSchema = Yup.object({
  name: Yup.string().required("Brand name is required"),
  active: Yup.boolean().required(),
});

function CreateBrandForm() {
  const [createBrand, { isLoading }] = useCreateBrandMutation();
  const {
    control,
    handleSubmit,
    setError,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(brandValidationSchema),
    defaultValues: {
      name: "",
      active: true,
    },
  });

  const onSubmit = handleSubmit(async (data) =>
    createBrand(data)
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
    <Card>
      <CardHeader
        title="Add New Brand"
        slotProps={{
          title: { variant: "body1", fontWeight: "bold" },
        }}
      />
      <Grid spacing={1} container m={1} flexDirection={"column"}>
        <Grid>
          <FormInputText control={control} label="Name" name="name" />
        </Grid>
        <Grid size="grow">
          <FormSwitchButton control={control} label="Enabled" name="active" />
        </Grid>
        <Grid alignContent={"center"}></Grid>
      </Grid>
      <CardActions>
        <PrimaryButton
          fullWidth
          Icon={AddIcon}
          label="Add New Brand"
          onClick={onSubmit}
          loading={isLoading}
        />
      </CardActions>
      <FormRootError errors={errors} />
    </Card>
  );
}

function BrandTable() {
  const { drawerWidth, open } = useDrawer();

  const columns = useMemo<MRT_ColumnDef<Category>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Category Id",
        enableEditing: false,
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
      },
      {
        id: "active",
        accessorKey: "active",
        header: "Active Status",
        Cell: ({ cell }) => (cell.getValue<boolean>() ? "Enabled" : "Disabled"),
      },
      {
        id: "productsCount",
        accessorKey: "_count.products",
        header: "Product Count",
        enableEditing: false,
      },
    ],
    []
  );

  const [fetchBrand, { data, isFetching }] = useLazyListBrandQuery();
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

  useEffect(() => {
    fetchBrand({});
  }, []);

  const table = useMaterialReactTable({
    enableColumnFilters: false,
    paginationDisplayMode: "pages",
    enableSelectAll: false,
    enableStickyHeader: true,
    enableRowSelection: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableRowActions: true,
    enableKeyboardShortcuts: true,
    enableEditing: true,
    editDisplayMode: "modal",
    layoutMode: "semantic",
    muiTableContainerProps: {
      sx: {
        maxHeight: "50vh",
        height: "auto",
        width: "auto",
        maxWidth: `calc(100vw - ${open ? drawerWidth : 0}px)`,
      },
    },
    initialState: {
      density: "compact",
      columnVisibility: {
        description: false,
      },
      showGlobalFilter: true,
    },
    columns,
    data: data || [],
    manualPagination: false,
    autoResetPageIndex: false,
    state: { isLoading: isFetching },
    renderTopToolbar: (props) => (
      <TopToolbar
        hideFilterButton
        hideFullScreenButton
        title="Brands"
        {...props}
      />
    ),
    renderRowActions: ({ table, row }) => [
      <CustomIconButton
        Icon={DeleteIcon}
        color="error"
        onClick={() => deleteBrand(row.getValue<number>("id"))}
      />,
      // <CustomIconButton
      //   Icon={EditIcon}
      //   onClick={() => table.setEditingRow(row)}
      // />,
    ],
    renderBottomToolbar: (props) => <BottomToolbar {...props} />,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
}

export default function CategoryAndBrands() {
  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, md: 9, lg: 9, xl: 9 }}>
        <CategoryTable />
        <Box m={1} />
        <BrandTable />
      </Grid>
      <Grid size={{ xs: 12, md: 3, lg: 3, xl: 3 }}>
        <CreateCategoryForm />
        <Box m={1} />
        <CreateBrandForm />
      </Grid>
    </Grid>
  );
}
