import { api } from "@/api/index";
import type { LoginRequestBody } from "@/types/auth";
import type { OnboardRequestBody } from "@/types/onboard";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials: LoginRequestBody) => ({
        url: "auth/login",
        body: credentials,
        method: "POST",
      }),
    }),
    onboard: build.mutation({
      query: (credentials: OnboardRequestBody) => ({
        url: "onboard",
        body: credentials,
        method: "POST",
      }),
    }),
    me: build.query({
      query: () => "me",
    }),
  }),
});

export const { useHealthQuery, useLoginMutation, useOnboardMutation } = authApi;
