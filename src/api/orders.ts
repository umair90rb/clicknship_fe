import { api } from "@/api/index";

export const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    listOrders: build.query({
      query: (params) => ({
        url: "orders",
        method: "GET",
        params,
      }),
    }),
    createOrder: build.mutation({
      query: (body: any) => ({
        url: "orders",
        body,
        method: "POST",
      }),
    }),
  }),
});

export const { useLazyListOrdersQuery, useCreateOrderMutation } = ordersApi;
