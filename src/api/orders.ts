import { api } from "@/api/index";
import type { OrderListApiResponse } from "@/types/order";
import type { GetOrderApiResponse } from "@/types/orders/detail";

export const ordersApi = api.injectEndpoints({
  // tagTypes: ["Order"],
  endpoints: (build) => ({
    listOrders: build.query<OrderListApiResponse, {}>({
      query: (body) => ({
        url: "orders",
        method: "POST",
        body,
      }),
      providesTags: (result, error, id) => [{ type: "Orders" }],
    }),
    getOrder: build.query<GetOrderApiResponse, string | number>({
      query: (id) => ({
        url: `orders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Orders", id }],
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
  useLazyListOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
} = ordersApi;
