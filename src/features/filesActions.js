import { createAsyncThunk } from "@reduxjs/toolkit";

import File from "../models/files";
import settings from "../constants/settings";
import { setFileList, setFilePredictions } from "./filesSlice";

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
          JSON.stringify({
            id: responseData[key].id,
            user: responseData[key].user,
            file: responseData[key].file,
            name: responseData[key].name,
            size: responseData[key].size,
            content_type: responseData[key].content_type,
            prediction_file: responseData[key].prediction_file,
            message: responseData[key].message ? responseData[key].message : null,
            created_at: responseData[key].created_at,
          })
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

export const fetchPredictions = createAsyncThunk(
  "files/fetchPredictions",
  async ({ id, token }, { rejectWithValue }) => {
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
      const url = settings.api_url + "/download/" + id + "/";
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("filesActions.fetchPredictions", errorData);
        // throw error
      }

      const responseData = await response.json();
      console.log(responseData);
      const predictions = [];
      for (const item of responseData["data"]) {
        const [id, score] = item.split(",");
        if (id === "id" || id === "") {
          // Skip the header and blank rows
          continue;
        }
        predictions.push(
          JSON.stringify({
            id: id,
            score: score,
          })
        );
      }

      setFilePredictions(predictions);
      return predictions;
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
