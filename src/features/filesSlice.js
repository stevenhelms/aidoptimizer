import { createSlice } from '@reduxjs/toolkit';

import { fetchFiles, fetchPredictions } from './filesActions';

const initialState = {
  isLoading: false,
  error: null,
  allFiles: [],
  filePredictions: [],
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setState: (state, action) => {
      state.isLoading = action.payload;
    },
    setFileList: (state, action) => {
      state.allFiles = action.payload;
    },
    setFilePredictions: (state, action) => {
      console.log('setFilePredictions', action.payload);
      state.filePredictions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFiles.pending, (state) => {
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
    builder.addCase(fetchPredictions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPredictions.fulfilled, (state, action) => {
      console.log('fetchPredictions.fulfilled', action.payload);
      state.isLoading = false;
      state.filePredictions = action.payload;
    });
    builder.addCase(fetchPredictions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { setState, setFileList, setFilePredictions } = filesSlice.actions;
export default filesSlice.reducer;
