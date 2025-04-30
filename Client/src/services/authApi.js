import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:" http://localhost:5173/login",
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