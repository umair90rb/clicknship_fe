import { api } from "@/api/index";
import type { OrderListApiResponse } from "@/types/orders/list";
import type { GetOrderApiResponse } from "@/types/orders/detail";

export const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    listOrders: build.query<OrderListApiResponse, {}>({
      query: (body) => ({
        url: "orders",
        method: "POST",
        body,
      }),
    }),
    getOrder: build.query<GetOrderApiResponse, string | number>({
      query: (id) => ({
        url: `orders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "order", id }],
    }),
    createOrder: build.mutation({
      query: (body: any) => ({
        url: "orders",
        body,
        method: "POST",
      }),
    }),
    updateOrder: build.mutation({
      query: ({ id, body }) => ({
        url: `orders/${id}`,
        body,
        method: "PATCH",
      }),
    }),

    postOrderComment: build.mutation({
      query: ({ orderId, data }) => ({
        url: `orders/${orderId}/comment`,
        body: data,
        method: "POST",
      }),
      onQueryStarted({ orderId }, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            response.meta?.response?.ok &&
              dispatch(
                ordersApi.util.updateQueryData("getOrder", orderId, (draft) => {
                  draft.data.comments.push(response?.data);
                })
              );
          })
          .catch();
      },
    }),
  }),
});

export const {
  useLazyListOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  usePostOrderCommentMutation,
} = ordersApi;
