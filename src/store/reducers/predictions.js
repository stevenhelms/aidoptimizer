import { GET_PREDICTION } from "../actions/predictions";

const initialState = {
  predictions: [],
  file: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PREDICTION:
      return {
        predictions: action.predictions,
        file: action.file,
      };
    default:
      return state;
  }
};

export default reducer;
