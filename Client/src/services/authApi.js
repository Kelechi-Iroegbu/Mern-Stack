import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";


export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:import.meta.env.VITE_BACKEND_URL,
    }),
    endpoints:(builder)=>({
        RegUser:builder.mutation({
            query : body=>{
                return{
                    url:"/api/auth/register",
                    method:"post",
                    body:{fullname:string,name:string,password:string},
                }
            }
        })
    })
})
export const {useRegUserMutation}=authApi;
