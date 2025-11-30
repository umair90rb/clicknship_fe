import { api } from "@/api/index";
import type {
  AvailableCourierIntegrationList,
  ListCourierIntegrationRequestResponse,
} from "@/types/courier";

export const courierApi = api.injectEndpoints({
  endpoints: (build) => ({
    listAvailableCourierIntegrations: build.query<
      AvailableCourierIntegrationList[],
      {}
    >({
      query: () => ({
        url: "couriers/available-integrations",
        method: "GET",
      }),
    }),
    listCourierIntegration: build.query<
      ListCourierIntegrationRequestResponse,
      {}
    >({
      query: (body) => ({
        url: "couriers",
        body,
        method: "POST",
      }),
      providesTags: (_) => ["couriers"],
    }),
    createCourierIntegration: build.mutation<any, {}>({
      query: (body: any) => ({
        url: "couriers/create",
        method: "POST",
        body,
      }),
      // invalidatesTags: ["couriers"],
    }),
  }),
});

export const {
  useListAvailableCourierIntegrationsQuery,
  useLazyListAvailableCourierIntegrationsQuery,
  useListCourierIntegrationQuery,
  useLazyListCourierIntegrationQuery,
  useCreateCourierIntegrationMutation,
} = courierApi;
