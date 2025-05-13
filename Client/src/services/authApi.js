import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl:import.meta.env.VITE_BACKEND_URL, }),
  endpoints: (builder) => ({
    RegUser: builder.mutation({
      query: (body) => ({
        url: '/api/auth/register',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: '/api/auth/Login',
        method: 'POST',
        body,
      }),
    }),
    getUserData: builder.query({
      query: () => ({
        url: '/api/user/data',
        method: 'GET',
      }),
    }),
  }),
});

export const { useRegUserMutation, useLoginMutation,useGetUserDataQuery} = authApi;