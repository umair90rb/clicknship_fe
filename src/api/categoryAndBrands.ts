import { api } from "@/api/index";
import type {
  BrandListApiResponse,
  CategoryListApiResponse,
} from "@/types/categoryAndBrands";

export const categoryAndBrandApi = api.injectEndpoints({
  endpoints: (build) => ({
    listCategory: build.query<CategoryListApiResponse, {}>({
      query: () => ({
        url: "categories",
        method: "GET",
      }),
    }),
    createCategory: build.mutation({
      query: (body: any) => ({
        url: "categories/create",
        body,
        method: "POST",
      }),
      onQueryStarted({}, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            response.meta?.response?.ok &&
              dispatch(
                categoryAndBrandApi.util.updateQueryData(
                  "listCategory",
                  {},
                  (categories) => {
                    categories.push(response.data);
                  }
                )
              );
          })
          .catch();
      },
    }),
    deleteCategory: build.mutation({
      query: (id: number) => ({
        url: `categories/${id}`,
        method: "DELETE",
      }),
      onQueryStarted(id, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            response.meta?.response?.ok &&
              dispatch(
                categoryAndBrandApi.util.updateQueryData(
                  "listCategory",
                  {},
                  (draft) => {
                    const index = draft.findIndex(
                      (category) => category.id === id
                    );
                    if (index !== -1) {
                      draft.splice(index, 1);
                    }
                  }
                )
              );
          })
          .catch();
      },
    }),

    listBrand: build.query<BrandListApiResponse, {}>({
      query: () => ({
        url: "brand",
        method: "GET",
      }),
    }),
    createBrand: build.mutation({
      query: (body: any) => ({
        url: "brand/create",
        body,
        method: "POST",
      }),
      onQueryStarted({}, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            response.meta?.response?.ok &&
              dispatch(
                categoryAndBrandApi.util.updateQueryData(
                  "listBrand",
                  {},
                  (categories) => {
                    categories.push(response.data);
                  }
                )
              );
          })
          .catch();
      },
    }),
    deleteBrand: build.mutation({
      query: (id: number) => ({
        url: `brand/${id}`,
        method: "DELETE",
      }),
      onQueryStarted(id, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            response.meta?.response?.ok &&
              dispatch(
                categoryAndBrandApi.util.updateQueryData(
                  "listBrand",
                  {},
                  (draft) => {
                    const index = draft.findIndex(
                      (category) => category.id === id
                    );
                    if (index !== -1) {
                      draft.splice(index, 1);
                    }
                  }
                )
              );
          })
          .catch();
      },
    }),
  }),
});

export const {
  useListCategoryQuery,
  useLazyListCategoryQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useListBrandQuery,
  useLazyListBrandQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,
} = categoryAndBrandApi;
