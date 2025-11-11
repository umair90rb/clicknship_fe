import { api } from "@/api/index";
import type { CreateSalesChannelRequestBody } from "@/types/channel";

export const channelApi = api.injectEndpoints({
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
    }),
  }),
});

export const {
  useListSalesChannelQuery,
  useLazyListSalesChannelQuery,
  useCreateSalesChannelMutation,
} = channelApi;
