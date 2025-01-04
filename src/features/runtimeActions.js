import { createAsyncThunk } from "@reduxjs/toolkit";

import { setIsLoading, setIsReporting } from "../features/runtimeSlice";
import settings from "../constants/settings";

export const fetchRuntime = createAsyncThunk(
    "runtime/fetchRuntime",
    async ({ token, module }, { rejectWithValue }) => {
        try {
            const config = {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    Authorization: "Token " + token,
                },
                withCredentials: true,
            };
            const url = settings.api_url + "/runtime/?module=" + module;
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json();
                console.log("fetchRuntime", errorData);
            }

            const responseData = await response.json();

            setIsLoading(responseData.isLoading);
            setIsReporting(responseData.isReporting);
            return responseData;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
