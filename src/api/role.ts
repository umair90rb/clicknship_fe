import { api } from "@/api/index";
import type { CreateRoleRequestBody, Permission, Role } from "@/types/role";

export const roleApi = api.injectEndpoints({
  endpoints: (build) => ({
    listPermissions: build.query<Permission[], {}>({
      query: () => ({
        url: "roles/available-permissions-list",
        method: "GET",
      }),
    }),
    listRole: build.query<Role[], {}>({
      query: () => ({
        url: "roles",
        method: "GET",
      }),
    }),
    createRole: build.mutation<Role, {}>({
      query: (body: CreateRoleRequestBody) => ({
        url: "roles",
        method: "POST",
        body,
      }),
      onQueryStarted(id, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            response.meta?.response?.ok &&
              dispatch(
                roleApi.util.updateQueryData("listRole", {}, (draft) => {
                  draft.push(response.data);
                })
              );
          })
          .catch();
      },
    }),
  }),
});

export const {
  useListPermissionsQuery,
  useLazyListPermissionsQuery,
  useLazyListRoleQuery,
  useListRoleQuery,
  useCreateRoleMutation,
} = roleApi;
