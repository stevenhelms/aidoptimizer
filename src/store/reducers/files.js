import { FETCH_FILES } from "../actions/files";

const initialState = {
  isLoading: false,
  error: null,
  allFiles: [],
  filePredictions: [],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FILES:
      return {
        allFiles: action.allFiles,
      };
    default:
      return state;
  }
};

export default reducer;
