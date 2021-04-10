import Prediction from "../../models/predictions";
import settings from "../../constants/settings";

export const GET_PREDICTION = "GET_PREDICTION";

export const predict = (id, token) => {
  console.log("api_token", token);
  return async (dispatch, getState) => {
    const response = await fetch(settings.api_url + `/predict/${id}/`, {
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
    console.log(responseData);
    const loadedPreds = [];

    for (const key in responseData["data"]) {
      loadedPreds.push(
        new Prediction(
          responseData["data"][key].id,
          responseData["data"][key].score
        )
      );
    }
    console.log(loadedPreds);
    dispatch({
      type: GET_PREDICTION,
      predictions: loadedPreds,
      file: responseData["csv_file"],
    });
  };
};
