import { User } from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.isLoading = false;

            // Store in localStorage
            if (typeof window !== "undefined") {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
            }
        },

        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };

                // Update localStorage
                if (typeof window !== "undefined") {
                    localStorage.setItem("user", JSON.stringify(state.user));
                }
            }
        },

        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isLoading = false;

            // Clear localStorage
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        },

        initializeAuth: (state) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("token");
                const userStr = localStorage.getItem("user");

                if (token && userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        state.user = user;
                        state.token = token;
                        state.isAuthenticated = true;
                    } catch (error) {
                        // Clear corrupted data
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                    }
                }
            }
            state.isLoading = false;
        },
    },
});

export const { setCredentials, updateUser, clearCredentials, initializeAuth } = authSlice.actions;

// Alias for clearCredentials to match expected import name
export const logout = clearCredentials;

export default authSlice.reducer;
