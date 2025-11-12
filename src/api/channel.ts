import { api } from "@/api/index";
import type { CreateSalesChannelRequestBody } from "@/types/channel";

export const salesChannelApi = api.injectEndpoints({
  endpoints: (build) => ({
    listSalesChannel: build.query({
      query: () => ({
        url: "sales-channel",
        method: "GET",
      }),
    }),
    createSalesChannel: build.mutation({
      query: (body: CreateSalesChannelRequestBody) => ({
        url: "sales-channel/create",
        body,
        method: "POST",
      }),
      onQueryStarted({}, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            response.meta?.response?.ok &&
              dispatch(
                salesChannelApi.util.updateQueryData(
                  "listSalesChannel",
                  {},
                  (channels) => {
                    channels.push(response.data);
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
  useListSalesChannelQuery,
  useLazyListSalesChannelQuery,
  useCreateSalesChannelMutation,
} = salesChannelApi;
