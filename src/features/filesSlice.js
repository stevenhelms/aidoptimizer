import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: null,
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    fetch: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { fetch } = filesSlice.actions;
export default filesSlice.reducer;
