import { api } from "@/api/index";

export const channelApi = api.injectEndpoints({
  endpoints: (build) => ({
    listProduct: build.query({
      query: (body) => ({
        url: "products",
        body,
        method: "POST",
      }),
    }),
  }),
});

export const { useLazyListProductQuery } = channelApi;
