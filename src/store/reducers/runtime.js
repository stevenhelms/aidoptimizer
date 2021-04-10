import { IS_LOADING, IS_REPORTING } from "../actions/runtime";

const initialState = {
  reporting: false,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case IS_REPORTING:
      return {
        ...state,
        reporting: action.reporting,
      };
    default:
      return state;
  }
};

export default reducer;
