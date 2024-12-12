import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import settings from "../../constants/settings";

const baseUrl = settings.api_url;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
        return headers;
      }
    },
  }),
  endpoints: (build) => ({
    getUserDetails: build.query({
      query: () => ({
        url: "user/",
        method: "GET",
      }),
    }),
  }),
});

// export react hook
export const { useGetUserDetailsQuery } = authApi;
