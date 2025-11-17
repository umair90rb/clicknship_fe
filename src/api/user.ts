import { api } from "@/api/index";
import type { ListUserApiResponse, User } from "@/types/users";

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    listUser: build.query<ListUserApiResponse, {}>({
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
      }),
      providesTags: (result) => {
        return result && "data" in result
          ? result.data.map((p: User) => ({ id: p.id, type: "users" }))
          : [{ type: "users", id: "LIST" }];
      },
    }),
    createUser: build.mutation({
      query: (body) => ({
        url: "users/create",
        body,
        method: "POST",
      }),
      invalidatesTags: [{ type: "users", id: "LIST" }],
    }),
  }),
});

export const { useListUserQuery, useLazyListUserQuery, useCreateUserMutation } =
  userApi;
