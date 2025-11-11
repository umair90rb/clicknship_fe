import { api } from "@/api/index";
import type { UnitListApiResponse } from "@/types/units";

export const unitApi = api.injectEndpoints({
  endpoints: (build) => ({
    listUnit: build.query<UnitListApiResponse, {}>({
      query: () => ({
        url: "unit",
        method: "GET",
      }),
    }),
    createUnit: build.mutation({
      query: (body: any) => ({
        url: "unit/create",
        body,
        method: "POST",
      }),
      onQueryStarted({}, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            response.meta?.response?.ok &&
              dispatch(
                unitApi.util.updateQueryData("listUnit", {}, (units) => {
                  units.push(response.data);
                })
              );
          })
          .catch();
      },
    }),
    deleteUnit: build.mutation({
      query: (id: number) => ({
        url: `unit/${id}`,
        method: "DELETE",
      }),
      onQueryStarted(id, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            response.meta?.response?.ok &&
              dispatch(
                unitApi.util.updateQueryData("listUnit", {}, (draft) => {
                  const index = draft.findIndex((unit) => unit.id === id);
                  if (index !== -1) {
                    draft.splice(index, 1);
                  }
                })
              );
          })
          .catch();
      },
    }),
  }),
});

export const {
  useListUnitQuery,
  useLazyListUnitQuery,
  useCreateUnitMutation,
  useDeleteUnitMutation,
} = unitApi;
