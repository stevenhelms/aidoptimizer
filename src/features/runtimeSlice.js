import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reporting: false,
  isLoading: false,
  workingFile: -1,
};

const runtime = createSlice({
  name: 'runtime',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsReporting: (state, action) => {
      state.reporting = action.payload;
    },
    setWorkingFile: (state, action) => {
      state.workingFile = action.payload;
    },
  },
});

export const { setIsLoading, setIsReporting, setWorkingFile } = runtime.actions;
export default runtime.reducer;
