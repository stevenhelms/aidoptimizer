import { createSlice } from "@reduxjs/toolkit";
import { userLogin } from "./authActions";

// initialize userToken from local storage
const userToken = localStorage.getItem("userToken")
  ? localStorage.getItem("userToken")
  : null;

const initialState = {
  isLoading: false,
  userInfo: null,
  userToken,
  error: null,
  success: false,
  errorField: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userToken"); // delete token from storage
      state.isLoading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
      state.errorField = null;
    },
    setCredentials: (state, { payload }) => {
      state.userInfo = payload;
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.errorField = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.userInfo = action.payload;
      state.userToken = payload.userToken;
      state.error = null;
      state.errorField = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.userInfo = null;
      state.error = action.payload;
    },
  },
});

export const {
  logout,
  setCredentials,
  loginStart,
  loginSuccess,
  loginFailure,
} = authSlice.actions;

export default authSlice.reducer;
