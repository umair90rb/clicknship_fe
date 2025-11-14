import { api } from "@/api/index";

export const roleApi = api.injectEndpoints({
  endpoints: (build) => ({
    listPermissions: build.query({
      query: () => ({
        url: "role/permissions",
        method: "GET",
      }),
    }),
  }),
});

export const { useListPermissionsQuery, useLazyListPermissionsQuery } = roleApi;
