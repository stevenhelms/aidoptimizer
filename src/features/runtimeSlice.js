import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reporting: false,
  isLoading: false,
};

const runtime = createSlice({
  name: "runtime",
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsReporting: (state, action) => {
      state.reporting = action.payload;
    },
  },
});

export const { setIsLoading, setIsReporting } = runtime.actions;
export default runtime.reducer;
