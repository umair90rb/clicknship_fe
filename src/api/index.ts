import { AUTH_TOKEN_KEY } from "@/constants/keys";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  validateStatus(response) {
    if (response.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.replace("/login");
      return false;
    }
    return true;
  },
  baseUrl: `http://${window.location.hostname}/api/v1/`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    console.log(token, "here is the token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const api = createApi({
  baseQuery,
  endpoints: (build) => ({
    health: build.query({
      query: () => "health",
    }),
  }),
});

export const { useHealthQuery } = api;
