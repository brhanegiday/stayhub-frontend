import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./api/auth-api";
import { propertiesApi } from "./api/properties-api";
import { bookingsApi } from "./api/bookings-api";
import { usersApi } from "./api/users-api";
import authSlice from "./slices/auth-slice";
import uiSlice from "./slices/ui-slice";
import preferencesSlice from "./slices/preferences-slice";

export const store = configureStore({
    reducer: {
        // API slices
        [authApi.reducerPath]: authApi.reducer,
        [propertiesApi.reducerPath]: propertiesApi.reducer,
        [bookingsApi.reducerPath]: bookingsApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,

        // Regular slices
        auth: authSlice,
        ui: uiSlice,
        preferences: preferencesSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    "persist/PERSIST",
                    "persist/REHYDRATE",
                    "persist/PAUSE",
                    "persist/PURGE",
                    "persist/REGISTER",
                ],
            },
        }).concat(authApi.middleware, propertiesApi.middleware, bookingsApi.middleware, usersApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
