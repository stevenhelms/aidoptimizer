import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import settings from '../constants/settings';

const backendURL = settings.api_url;

export const userLogin = createAsyncThunk(
  'auth/login',
  async ({ username, password, csrfmiddlewaretoken }, { rejectWithValue }) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfmiddlewaretoken,
        },
        withCredentials: true, // send cookies when cross-domain requests
      };

      const response = await axios.post(
        `${backendURL}/api-token-auth/`,
        { username, password, csrfmiddlewaretoken },
        config
      );
      return response.data;
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
