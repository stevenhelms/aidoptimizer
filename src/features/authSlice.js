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
      console.log("logout");
      // localStorage.removeItem("userToken"); // delete token from storage
      state.isLoading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
      state.errorField = null;
    },
    setCredentials: (state, { payload }) => {
      console.log("setCredentials", payload);
      state.userInfo = payload;
    },
    loginStart: (state) => {
      console.log("loginStart");
      state.isLoading = true;
      state.error = null;
      state.errorField = null;
    },
    loginSuccess: (state, action) => {
      console.log("loginSuccess", action);
      state.isLoading = false;
      state.userInfo = action.payload;
      state.userToken = payload.userToken;
      state.error = null;
      state.errorField = null;
      localStorage.setItem("userToken", payload.userToken); // save token to storage
    },
    loginFailure: (state, action) => {
      console.log("loginFailure", action);
      state.isLoading = false;
      state.userInfo = null;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add extra reducers here
    builder.addCase(userLogin.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(userLogin.fulfilled, (state, action) => {
      // console.log("userLogin.fulfilled", action);
      // console.log("userLogin.fulfilled.payload", action.payload);
      // console.log("userLogin.fulfilled.payload.token", action.payload.token);
      localStorage.setItem("userToken", action.payload.token); // save token to storage
      state.isLoading = false;
      state.userInfo = action.payload;
      state.userToken = action.payload.token;
      state.error = null;
      state.errorField = null;
    });

    builder.addCase(userLogin.rejected, (state, action) => {
      console.log("userLogin.rejected", action);
      state.isLoading = false;
      state.userInfo = null;
      state.error = action.payload;
    });
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
