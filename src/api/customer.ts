import { api } from "@/api/index";

export const customerApi = api.injectEndpoints({
  endpoints: (build) => ({
    listCustomer: build.query({
      query: (body) => ({
        url: "customers",
        body,
        method: "POST",
      }),
    }),
    searchCustomer: build.query({
      query: (body) => ({
        url: "customers/search",
        body,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useListCustomerQuery,
  useLazyListCustomerQuery,
  useLazySearchCustomerQuery,
} = customerApi;
