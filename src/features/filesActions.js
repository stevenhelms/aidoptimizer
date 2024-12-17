import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import File from "../models/files";
import settings from "../constants/settings";
import { setFileList } from "./filesSlice";

export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async ({ token, fileType }, { rejectWithValue }) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: "Token " + token,
        },
        withCredentials: true, // send cookies when cross-domain requests
      };
      const url = settings.api_url + "/files/?module=" + fileType;
      const response = await fetch(url, config);

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

      setFileList(loadedFiles);
      return loadedFiles;
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
