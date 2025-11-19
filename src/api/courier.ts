import { api } from "@/api/index";
import type { AvailableCourierIntegrationList } from "@/types/courier";

export const courierApi = api.injectEndpoints({
  endpoints: (build) => ({
    listAvailableIntegrations: build.query<
      AvailableCourierIntegrationList[],
      {}
    >({
      query: () => ({
        url: "couriers/available-integrations",
        method: "GET",
      }),
    }),
    listIntegration: build.query<any[], {}>({
      query: () => ({
        url: "couriers",
        method: "GET",
      }),
    }),
    createIntegration: build.mutation<any, {}>({
      query: (body: any) => ({
        url: "couriers",
        method: "POST",
        body,
      }),
      onQueryStarted(id, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((response) => {
            response.meta?.response?.ok &&
              dispatch(
                courierApi.util.updateQueryData(
                  "listIntegration",
                  {},
                  (draft) => {
                    draft.push(response.data);
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
  useListAvailableIntegrationsQuery,
  useLazyListAvailableIntegrationsQuery,
  useListIntegrationQuery,
  useLazyListIntegrationQuery,
  useCreateIntegrationMutation,
} = courierApi;
