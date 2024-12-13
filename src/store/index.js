import { configureStore } from "@reduxjs/toolkit";

import AuthReducer from "./reducers/auth";
import FilesReducer from "./reducers/files";
import PredictionsReducer from "./reducers/predictions";
import RuntimeReducer from "./reducers/runtime";

export const createStore = (state) => {
  configureStore({
    dispatch: {
      onTryAutoSignup: () => dispatch(actions.authCheckState()),
    },
    reducer: {
      auth: AuthReducer,
      files: FilesReducer,
      predictions: PredictionsReducer,
      runtime: RuntimeReducer,
    },
    // preloadedState: {
    //   isAuthenticated: state?.auth.token !== null,
    //   token: state?.auth.token,
    // },
  });
};

// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  userInfo: {}, // for user object
  userToken: null, // for storing the JWT
  error: null,
  success: false, // for monitoring the registration process.
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  // extraReducers: {},
});

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});
export default store;
