import { createSlice } from "@reduxjs/toolkit";

import { fetchFiles } from "./filesActions";

const initialState = {
  isLoading: false,
  error: null,
  allFiles: [],
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setState: (state, action) => {
      state.isLoading = action.payload;
    },
    setFileList: (state, action) => {
      state.allFiles = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFiles.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchFiles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.allFiles = action.payload;
    });
    builder.addCase(fetchFiles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { setState, setFileList } = filesSlice.actions;
export default filesSlice.reducer;
