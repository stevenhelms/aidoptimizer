import { IS_LOADING, IS_REPORTING } from '../actions/runtime';

const initialState = {
  reporting: false,
  isLoading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
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
