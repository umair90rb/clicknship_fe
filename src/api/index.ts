import { AUTH_TOKEN_KEY } from "@/constants/keys";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  validateStatus(response, body) {
    if (response.status === 401) {
      if (body?.message === "jwt expired") {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        window.location.replace(
          "/login?message=Login token expired, please login again to continue&success=false"
        );
        return false;
      }
      return false;
    }
    return response.status >= 200 && response.status < 300;
  },
  baseUrl: `http://${window.location.hostname}/api/v1/`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const api = createApi({
  baseQuery,
  tagTypes: ["orders", "order"],
  endpoints: (build) => ({
    health: build.query({
      query: () => "health",
    }),
  }),
});

export const { useHealthQuery } = api;
