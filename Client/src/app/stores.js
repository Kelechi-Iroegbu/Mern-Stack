import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "../services/authApi";
import {setupListeners} from "@reduxjs/toolkit/query/react";


export const store = configureStore({
    reducer:{
        [authApi.reducerPath]:authApi.reducer
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware)
});
setupListeners(store.dispatch);