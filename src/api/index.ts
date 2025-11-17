import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/keys";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  // validateStatus(response, body) {
  //   if (response.status === 401) {
  //     if (body?.message === "jwt expired") {
  //       localStorage.removeItem(AUTH_TOKEN_KEY);
  //       window.location.replace(
  //         "/login?message=Login token expired, please login again to continue&success=false"
  //       );
  //       return false;
  //     }
  //     return false;
  //   }
  //   return response.status >= 200 && response.status < 300;
  // },
  baseUrl: `http://${window.location.hostname}/api/v1/`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const message = result?.error?.data?.message;

    // 🕒 Case 1: Access token expired
    if (message === "jwt expired") {
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) throw new Error("No refresh token found");

        // Call refresh endpoint
        const refreshResult = await baseQuery(
          {
            url: "auth/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult?.data?.access_token) {
          const newToken = refreshResult.data.access_token;
          const refreshToken = refreshResult.data.refresh_token;
          localStorage.setItem(AUTH_TOKEN_KEY, newToken);
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

          // Retry the original query with new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (err) {
        // ❌ Refresh failed — redirect to login
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem("refreshToken");
        const currentPath = window.location.pathname;
        window.location.replace(
          `/login?redirect=${encodeURIComponent(
            currentPath
          )}&message=Session expired, please login again&success=false`
        );
      }
    } else {
      // 🧱 Case 2: Invalid token or other 401
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      window.location.replace(
        "/login?message=Invalid session, please login again&success=false"
      );
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["orders", "order", "units", "products", "users"],
  endpoints: (build) => ({
    health: build.query({
      query: () => "health",
    }),
  }),
});

export const { useHealthQuery } = api;
