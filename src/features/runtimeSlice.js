import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reporting: false,
  isLoading: false,
};

const runtimeSlice = createSlice({
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

export const { setIsLoading, setIsReporting } = runtimeSlice.actions;

export default runtimeSlice.reducer;
// Compare this snippet from src/store/actions/runtime.js:
