import File from "../../models/files";
import settings from "../../constants/settings";

export const FETCH_FILES = "FETCH_FILES";

export const fetchFiles = (token, fileType) => {
  return async (dispatch, getState) => {
    const url = settings.api_url + "/files/?module=" + fileType;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Token " + token,
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
      // throw error
    }

    const responseData = await response.json();

    const loadedFiles = [];

    for (const key in responseData) {
      const fileData = {
        file: responseData[key].file,
        name: responseData[key].name,
        size: responseData[key].size,
        content_type: responseData[key].content_type,
        prediction_file: responseData[key].prediction_file,
        message: responseData[key].message ? responseData[key].message : null,
        created_at: responseData[key].created_at,
      };
      loadedFiles.push(
        new File(responseData[key].id, responseData[key].user, fileData)
      );
    }

    dispatch({
      type: FETCH_FILES,
      allFiles: loadedFiles,
    });
  };
};
