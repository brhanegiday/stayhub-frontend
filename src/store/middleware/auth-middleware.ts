/* eslint-disable @typescript-eslint/no-explicit-any */
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "..";
import { authApi } from "../api/auth-api";
import { logout, setCredentials } from "../slices/auth-slice";

export const authMiddleware = createListenerMiddleware();

// Listen for 401 errors and attempt to refresh token
authMiddleware.startListening({
    matcher: isAnyOf(
        authApi.endpoints.getMe.matchRejected,
        authApi.endpoints.updateProfile.matchRejected
        // Add other protected endpoints as needed
    ),
    effect: async (action, listenerApi) => {
        // Check if it's a 401 error
        if (action.payload && typeof action.payload === 'object' && 'status' in action.payload && action.payload.status === 401) {
            try {
                // Get current state to maintain user data
                const state = listenerApi.getState() as RootState;

                // Attempt to refresh the token
                const refreshResult = await listenerApi.dispatch(
                    authApi.endpoints.refreshToken.initiate()
                ).unwrap();

                if (refreshResult.data?.token && state.auth.user) {
                    // Update the auth state with the new token
                    listenerApi.dispatch(
                        setCredentials({
                            token: refreshResult.data.token,
                            user: state.auth.user,
                        })
                    );
                }
            } catch (refreshError) {
                // If refresh fails, logout the user
                console.error("Token refresh failed:", refreshError);
                listenerApi.dispatch(logout());
            }
        }
    },
});

// Listen for successful login/register to set credentials
authMiddleware.startListening({
    matcher: isAnyOf(
        authApi.endpoints.login.matchFulfilled,
        authApi.endpoints.register.matchFulfilled,
        authApi.endpoints.googleAuth.matchFulfilled
    ),
    effect: (action, listenerApi) => {
        const payload = action.payload as any;
        if (payload?.data?.user && payload?.data?.token) {
            listenerApi.dispatch(
                setCredentials({
                    user: payload.data.user,
                    token: payload.data.token,
                })
            );
        }
    },
});

// Auto-logout on token expiration
let tokenExpirationTimeout: NodeJS.Timeout | null = null;

authMiddleware.startListening({
    actionCreator: setCredentials,
    effect: (action, listenerApi) => {
        // Clear existing timeout
        if (tokenExpirationTimeout) {
            clearTimeout(tokenExpirationTimeout);
        }

        if (action.payload.token) {
            try {
                // Decode JWT to get expiration time
                const tokenData = JSON.parse(atob(action.payload.token.split(".")[1]));
                const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
                const currentTime = Date.now();
                const timeUntilExpiration = expirationTime - currentTime;

                // Set timeout to refresh token 5 minutes before expiration
                const refreshTime = Math.max(timeUntilExpiration - 5 * 60 * 1000, 0);

                if (refreshTime > 0) {
                    tokenExpirationTimeout = setTimeout(async () => {
                        try {
                            const result = await listenerApi
                                .dispatch(authApi.endpoints.refreshToken.initiate())
                                .unwrap();

                            if (result.data?.token) {
                                // Get current state to maintain user data
                                const state = listenerApi.getState() as RootState;

                                // Only update if user exists
                                if (state.auth.user) {
                                    // Update with new token
                                    listenerApi.dispatch(
                                        setCredentials({
                                            token: result.data.token,
                                            user: state.auth.user,
                                        })
                                    );
                                }
                            }
                        } catch (error) {
                            console.error("Automatic token refresh failed:", error);
                            listenerApi.dispatch(logout());
                        }
                    }, refreshTime);
                }
            } catch (error) {
                console.error("Error parsing token:", error);
            }
        }
    },
});
