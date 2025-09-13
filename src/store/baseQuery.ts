/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from ".";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
    prepareHeaders: (headers, { getState }) => {
        // Get token from state or localStorage
        const token = (getState() as RootState).auth.token || localStorage.getItem("token");

        // Set common headers
        headers.set("Content-Type", "application/json");

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return headers;
    },
});

export default baseQuery;
