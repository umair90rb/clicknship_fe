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
        return [
          { type: "products", id: "LIST" },
          "data" in result &&
            result.data.map((p: Product) => ({ id: p.id, type: "products" })),
        ];
      },
    }),
    createProduct: build.mutation({
      query: (body: CreateProductRequestBody) => ({
        url: "products/create",
        body,
        method: "POST",
      }),
      invalidatesTags: [{ type: "products", id: "LIST" }],
      // onQueryStarted({}, { dispatch, queryFulfilled }) {
      //   queryFulfilled
      //     .then((response) => {
      //       response.meta?.response?.ok &&
      //         dispatch(
      //           productApi.util.updateQueryData(
      //             "listProduct",
      //             {},
      //             (products) => {
      //               products.data.push(response.data);
      //             },
      //             true
      //           )
      //         );
      //     })
      //     .catch((e) => console.log(e));
      // },
    }),
  }),
});

export const {
  useListProductQuery,
  useLazyListProductQuery,
  useCreateProductMutation,
} = productApi;
