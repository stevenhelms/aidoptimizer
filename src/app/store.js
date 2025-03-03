import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import runtime from '../features/runtimeSlice';
import filesReducer from '../features/filesSlice';
import predictionsReducer from '../features/predictionsSlice';
import { authApi } from './services/authService';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    runtime: runtime,
    files: filesReducer,
    predictions: predictionsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
