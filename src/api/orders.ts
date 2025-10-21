import { api } from "@/api/index";
import type { OrderListApiResponse } from "@/types/orders/list";
import type { GetOrderApiResponse, Item } from "@/types/orders/detail";
import { createSelector } from "@reduxjs/toolkit";

export const selectOrderById = (id: number) =>
  createSelector(
    ordersApi.endpoints.getOrder.select(id),
    (result) => result.data?.data
  );

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
      onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            response.meta?.response?.ok &&
              dispatch(
                ordersApi.util.updateQueryData("getOrder", id, (draft) => {
                  Object.assign(draft.data, response.data);
                })
              );
          })
          .catch();
      },
    }),
    updateOrderStatus: build.mutation({
      query: ({ orderId, status }) => ({
        url: `orders/${orderId}/status`,
        body: { status },
        method: "PATCH",
      }),
      onQueryStarted({ orderId }, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            response.meta?.response?.ok &&
              dispatch(
                ordersApi.util.updateQueryData("getOrder", orderId, (draft) => {
                  Object.assign(draft.data, response.data);
                })
              );
          })
          .catch();
      },
    }),
    createOrderComment: build.mutation({
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

    createOrderItem: build.mutation({
      query: ({ orderId, body }) => ({
        url: `orders/${orderId}/item`,
        body,
        method: "POST",
      }),
      onQueryStarted({ orderId }, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            response.meta?.response?.ok &&
              dispatch(
                ordersApi.util.updateQueryData("getOrder", orderId, (draft) => {
                  const index = draft.data.items.findIndex(
                    (i) => i.id === response?.data?.id
                  );
                  if (index > -1) {
                    draft.data.items[index] = response?.data;
                  } else {
                    draft.data.items.push(response?.data);
                  }
                })
              );
          })
          .catch();
      },
    }),

    updateOrderItem: build.mutation({
      query: ({ orderId, itemId, body }) => ({
        url: `orders/${orderId}/item/${itemId}`,
        body,
        method: "PATCH",
      }),
      onQueryStarted({ orderId, itemId }, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            if (response.meta?.response?.ok) {
              dispatch(
                ordersApi.util.updateQueryData("getOrder", orderId, (draft) => {
                  Object.assign(
                    draft.data.items.find((item) => item.id === itemId) as Item,
                    response?.data
                  );
                })
              );
            }
          })
          .catch();
      },
    }),

    deleteOrderItem: build.mutation({
      query: ({ orderId, itemId }) => ({
        url: `orders/${orderId}/item/${itemId}`,
        method: "DELETE",
      }),
      onQueryStarted({ orderId, itemId }, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            if (response.meta?.response?.ok) {
              dispatch(
                ordersApi.util.updateQueryData("getOrder", orderId, (draft) => {
                  const index = draft.data.items.findIndex(
                    (i) => i.id === itemId
                  );
                  if (index > -1) draft.data.items.splice(index, 1);
                })
              );
            }
          })
          .catch();
      },
    }),

    createOrderPayment: build.mutation({
      query: ({ orderId, body }) => ({
        url: `orders/${orderId}/payment`,
        body,
        method: "POST",
      }),
      onQueryStarted({ orderId }, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            response.meta?.response?.ok &&
              dispatch(
                ordersApi.util.updateQueryData("getOrder", orderId, (draft) => {
                  draft.data.payments.push(response?.data);
                })
              );
          })
          .catch();
      },
    }),

    searchCustomer: build.mutation({
      query: (body) => ({
        url: `customers/search`,
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
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useCreateOrderCommentMutation,
  useCreateOrderItemMutation,
  useUpdateOrderItemMutation,
  useDeleteOrderItemMutation,
  useCreateOrderPaymentMutation,
  useSearchCustomerMutation,
} = ordersApi;
