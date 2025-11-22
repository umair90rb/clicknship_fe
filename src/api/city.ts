import { api } from "@/api/index";
import type { City, ListCitiesRequestResponse } from "@/types/city";

export const cityApi = api.injectEndpoints({
  endpoints: (build) => ({
    listCities: build.query<ListCitiesRequestResponse, {}>({
      query: (body) => ({
        url: "cities",
        body,
        method: "POST",
      }),
      providesTags: (_) => ["cities"],
    }),
    getCity: build.query<City, {}>({
      query: (id) => ({
        url: `cities/${id}`,
        method: "GET",
      }),
      providesTags: (_) => ["cities"],
    }),
    createCity: build.mutation<any, {}>({
      query: (body: any) => ({
        url: "cities/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["cities"],
    }),
  }),
});

export const {
  useListCitiesQuery,
  useLazyListCitiesQuery,
  useGetCityQuery,
  useLazyGetCityQuery,
  useCreateCityMutation,
} = cityApi;
