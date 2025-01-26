import settings from '../../constants/settings';

export const GET_PREDICTION = 'GET_PREDICTION';

export const predict = (id, token) => {
  return async (dispatch) => {
    const response = await fetch(settings.api_url + `/predict/${id}/`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
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

    for (const key in responseData['data']) {
      loadedPreds.push(
        JSON.stringify({
          id: responseData['data'][key].id,
          score: responseData['data'][key].score,
        })
      );
    }
    console.log(loadedPreds);
    dispatch({
      type: GET_PREDICTION,
      predictions: loadedPreds,
      file: responseData['csv_file'],
    });
  };
};
