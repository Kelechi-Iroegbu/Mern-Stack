import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";


export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:import.meta.env.VITE_BACKEND_URL,
    }),
    endpoints:(builder)=>({
        loginUser:builder.mutation({
            query : (body)=>{
                return{
                    url:"/Login",
                    method:"post",
                    body,
                }
            }
        })
    })
})
export const {useLoginUserMutation}=authApi;