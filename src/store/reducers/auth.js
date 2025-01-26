import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  token: null,
  error: null,
  errorField: null,
  isLoading: false,
  isAuthenticated: false,
  authRedirectPath: '/',
};

const authStart = (state) => {
  return updateObject(state, {
    error: null,
    errorField: null,
    isLoading: true,
  });
};

const authSuccess = (state, action) => {
  // console.log('---- authSuccess ----');
  // console.log(state);
  // console.log(action);

  return updateObject(state, {
    token: action.token,
    error: null,
    errorField: null,
    isLoading: false,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    errorField: action.errorField,
    isLoading: false,
  });
};

const authLogout = (state) => {
  return updateObject(state, { token: null, userId: null });
};

const setAuthRedirectPath = (state, action) => {
  return updateObject(state, { authRedirectPath: action.path });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state, action);
    default:
      return state;
  }
};

export default reducer;
