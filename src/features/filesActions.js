import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import File from "../models/files";
import settings from "../constants/settings";

// export const fetchFiles = (token, fileType) => {
export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async ({ token, fileType }, { rejectWithValue }) => {
    console.log("fetchFiles fileType", fileType);

    const url = settings.api_url + "/files/?module=" + fileType;
    const response = await axios.get(url, {
      method: "GET",
      headers: {
        Authorization: "Token " + token,
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("fetchFiles", errorData);
      // throw error
    }

    const responseData = await response.json();

    const loadedFiles = [];

    for (const key in responseData) {
      loadedFiles.push(
        new File(
          responseData[key].id,
          responseData[key].user,
          responseData[key].file,
          responseData[key].name,
          responseData[key].size,
          responseData[key].content_type,
          responseData[key].prediction_file,
          responseData[key].created_at
        )
      );
    }

    dispatch({
      type: FETCH_FILES,
      allFiles: loadedFiles,
    });
  }
);
