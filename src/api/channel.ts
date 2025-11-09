import { api } from "@/api/index";

export const channelApi = api.injectEndpoints({
  endpoints: (build) => ({
    onboard: build.mutation({
      query: (body) => ({
        url: "channel",
        body,
        method: "POST",
      }),
    }),
  }),
});

export const { useOnboardMutation } = channelApi;
