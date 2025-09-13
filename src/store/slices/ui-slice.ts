import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
    sidebarOpen: boolean;
    theme: "light" | "dark" | "system";
    searchFilters: {
        city?: string;
        country?: string;
        minPrice?: number;
        maxPrice?: number;
        propertyType?: string;
        bedrooms?: number;
        maxGuests?: number;
        search?: string;
    };
    notifications: Array<{
        id: string;
        type: "success" | "error" | "warning" | "info";
        title: string;
        message: string;
        timestamp: number;
    }>;
}

const initialState: UIState = {
    sidebarOpen: false,
    theme: "system",
    searchFilters: {},
    notifications: [],
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },

        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },

        setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
            state.theme = action.payload;
        },

        setSearchFilters: (state, action: PayloadAction<UIState["searchFilters"]>) => {
            state.searchFilters = { ...state.searchFilters, ...action.payload };
        },

        clearSearchFilters: (state) => {
            state.searchFilters = {};
        },

        addNotification: (state, action: PayloadAction<Omit<UIState["notifications"][0], "id" | "timestamp">>) => {
            const notification = {
                ...action.payload,
                id: Date.now().toString(),
                timestamp: Date.now(),
            };
            state.notifications.push(notification);
        },

        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter((n) => n.id !== action.payload);
        },

        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const {
    toggleSidebar,
    setSidebarOpen,
    setTheme,
    setSearchFilters,
    clearSearchFilters,
    addNotification,
    removeNotification,
    clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
