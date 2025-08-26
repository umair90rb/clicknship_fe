import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${window.location.hostname}/api/v1/` }),
  endpoints: (build) => ({
    health: build.query({
      query: () => 'health',
    }),
  }),
});

export const { useHealthQuery } = api;
