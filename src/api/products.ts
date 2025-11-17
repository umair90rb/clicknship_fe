import { api } from "@/api/index";
import type { CreateProductRequestBody, Product } from "@/types/products";

export const productApi = api.injectEndpoints({
  endpoints: (build) => ({
    listProduct: build.query({
      query: (body) => ({
        url: "products",
        body,
        method: "POST",
      }),
      providesTags: (result) => {
        console.log(result);
        return "data" in result
          ? result.data.map((p: Product) => ({ id: p.id, type: "products" }))
          : [{ type: "products", id: "LIST" }];
      },
    }),
    createProduct: build.mutation({
      query: (body: CreateProductRequestBody) => ({
        url: "products/create",
        body,
        method: "POST",
      }),
      invalidatesTags: [{ type: "products", id: "LIST" }],
    }),
  }),
});

export const {
  useListProductQuery,
  useLazyListProductQuery,
  useCreateProductMutation,
} = productApi;
