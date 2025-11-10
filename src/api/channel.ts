import { api } from "@/api/index";

export const channelApi = api.injectEndpoints({
  endpoints: (build) => ({
    listChannel: build.query({
      query: (body) => ({
        url: "channel",
        body,
        method: "POST",
      }),
    }),
  }),
});

export const { useListChannelQuery, useLazyListChannelQuery } = channelApi;
