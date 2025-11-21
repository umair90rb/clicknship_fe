import { api } from "@/api/index";
import type {
  AvailableCourierIntegrationList,
  CourierIntegration,
  ListCourierIntegrationRequestResponse,
} from "@/types/courier";

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
    listIntegration: build.query<ListCourierIntegrationRequestResponse, {}>({
      query: (body) => ({
        url: "couriers",
        body,
        method: "POST",
      }),
      providesTags: (_) => ["couriers"],
    }),
    createIntegration: build.mutation<any, {}>({
      query: (body: any) => ({
        url: "couriers/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["couriers"],
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
