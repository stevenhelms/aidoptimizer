import File from "../../models/files";
import settings from "../../constants/settings";

export const FETCH_FILES = "FETCH_FILES";

export const fetchFiles = (token, fileType) => {
  // let token = localStorage.getItem("token");
  // console.log('fetchFiles localstorage token: '+ token);
  // token = stateToken;
  // console.log('fetchFiles parameter token: '+ stateToken);

  return async (dispatch, getState) => {
    const url = settings.api_url + "/files/?module=" + fileType;
    // console.log("fetchFiles url", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Token " + token,
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
  };
};
