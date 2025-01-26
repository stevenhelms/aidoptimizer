import { createSlice } from '@reduxjs/toolkit';

import { userLogin } from './authActions';

// initialize userToken from local storage
const userToken = localStorage.getItem('userToken') ? localStorage.getItem('userToken') : null;

const initialState = {
  isLoading: false,
  userInfo: null,
  userToken,
  error: null,
  success: false,
  errorField: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userToken'); // delete token from storage
      state.isLoading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
      state.errorField = null;
    },
    setCredentials: (state, { payload }) => {
      console.log('setCredentials', payload);
      state.userInfo = payload;
      state.userToken = payload.token;
      localStorage.setItem('userToken', payload.token); // save token to storage
    },
    setAuthIsLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
  },
  extraReducers: (builder) => {
    // Add extra reducers here
    builder.addCase(userLogin.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(userLogin.fulfilled, (state, action) => {
      localStorage.setItem('userToken', action.payload.token); // save token to storage
      state.isLoading = false;
      state.userInfo = action.payload;
      state.userToken = action.payload.token;
      state.error = null;
      state.errorField = null;
    });

    builder.addCase(userLogin.rejected, (state, action) => {
      console.log('userLogin.rejected', action);
      state.isLoading = false;
      state.userInfo = null;
      state.error = action.payload;
    });
  },
});

export const { logout, setCredentials, setAuthIsLoading } = authSlice.actions;
export default authSlice.reducer;
