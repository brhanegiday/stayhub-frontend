/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PreferencesState {
    currency: "USD" | "EUR" | "GBP" | "JPY";
    language: "en" | "es" | "fr" | "de";
    dateFormat: "MM/dd/yyyy" | "dd/MM/yyyy" | "yyyy-MM-dd";
    timeFormat: "12h" | "24h";
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
        booking: boolean;
        marketing: boolean;
    };
    savedSearches: Array<{
        id: string;
        name: string;
        filters: any;
        createdAt: string;
    }>;
    favorites: string[]; // Property IDs
}

const initialState: PreferencesState = {
    currency: "USD",
    language: "en",
    dateFormat: "MM/dd/yyyy",
    timeFormat: "12h",
    notifications: {
        email: true,
        push: true,
        sms: false,
        booking: true,
        marketing: false,
    },
    savedSearches: [],
    favorites: [],
};

const preferencesSlice = createSlice({
    name: "preferences",
    initialState,
    reducers: {
        setCurrency: (state, action: PayloadAction<PreferencesState["currency"]>) => {
            state.currency = action.payload;
        },

        setLanguage: (state, action: PayloadAction<PreferencesState["language"]>) => {
            state.language = action.payload;
        },

        setDateFormat: (state, action: PayloadAction<PreferencesState["dateFormat"]>) => {
            state.dateFormat = action.payload;
        },

        setTimeFormat: (state, action: PayloadAction<PreferencesState["timeFormat"]>) => {
            state.timeFormat = action.payload;
        },

        updateNotificationSettings: (state, action: PayloadAction<Partial<PreferencesState["notifications"]>>) => {
            state.notifications = { ...state.notifications, ...action.payload };
        },

        addSavedSearch: (
            state,
            action: PayloadAction<Omit<PreferencesState["savedSearches"][0], "id" | "createdAt">>
        ) => {
            const savedSearch = {
                ...action.payload,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
            };
            state.savedSearches.push(savedSearch);
        },

        removeSavedSearch: (state, action: PayloadAction<string>) => {
            state.savedSearches = state.savedSearches.filter((s) => s.id !== action.payload);
        },

        addToFavorites: (state, action: PayloadAction<string>) => {
            if (!state.favorites.includes(action.payload)) {
                state.favorites.push(action.payload);
            }
        },

        removeFromFavorites: (state, action: PayloadAction<string>) => {
            state.favorites = state.favorites.filter((id) => id !== action.payload);
        },

        clearFavorites: (state) => {
            state.favorites = [];
        },
    },
});

export const {
    setCurrency,
    setLanguage,
    setDateFormat,
    setTimeFormat,
    updateNotificationSettings,
    addSavedSearch,
    removeSavedSearch,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
