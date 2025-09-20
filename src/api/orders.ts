import { api } from "@/api/index";
import type { Order } from "@/types/order";

export const ordersApi = api.injectEndpoints({
  // tagTypes: ["Order"],
  endpoints: (build) => ({
    listOrders: build.mutation({
      query: (body) => ({
        url: "orders",
        method: "POST",
        body,
      }),
    }),
    getOrder: build.query<Order, string | number>({
      query: (id) => ({
        url: `orders/${id}`,
        method: "GET",
      }),
      // providesTags: (result, error, id) => [{ type: "Post", id }],
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

export const {
  useListOrdersMutation,
  useGetOrderQuery,
  useCreateOrderMutation,
} = ordersApi;
