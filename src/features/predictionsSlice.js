import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  predictions: [],
  file: {},
};

const predictionsSlice = createSlice({
  name: "predictions",
  initialState,
  reducers: {
    getPrediction: (state, action) => {
      state.predictions = action.payload.predictions;
      state.file = action.payload.file;
    },
  },
});

export const { getPrediction } = predictionsSlice.actions;
export default predictionsSlice.reducer;
