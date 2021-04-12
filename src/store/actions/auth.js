import axios from "axios";

import settings from "../../constants/settings";
import * as actionTypes from "./actionTypes";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
  };
};

export const authFail = (error) => {
  // let msg = '';

  // let keys = Object.keys(error.data);
  let [msg, field] = Object.keys(error?.data).map((key) => {
    let m = "";
    if (key === "email" || key === "password") {
      m = key.charAt(0).toUpperCase() + key.slice(1) + ": ";
    }
    // console.log('authFail: '+ key);
    return m + error?.data[key] + " ";
  });

  return {
    type: actionTypes.AUTH_FAIL,
    error: msg,
    errorField: field,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

export const auth = (email, password) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
    };

    let url = settings.api_url + "/auth/login/";
    const options = {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios
      .post(url, authData, options)
      .then((response) => {
        // console.log('--- actions/auth.js const auth ---');
        // console.log(response);
        // console.log(response.data.key);
        const expirationDate = new Date(new Date().getTime() + 86400 * 1000); // One day expiration
        localStorage.setItem("token", response.data.key);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(response.key));
        // dispatch(checkAuthTimeout(expirationDate));
      })
      .catch((err) => {
        dispatch(authFail(err.response));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const authCheckState = () => {
  return (dispatch, getState) => {
    let token = localStorage.getItem("token");
    // console.log("---authCheckState--- 1 token " + token);

    if (!token) {
      // Try using the redux state if it's not in localStorage yet.
      // console.log("---authCheckState--- 2 token " + token);
      console.log(getState());

      token = getState().auth.token;
    }

    if (!token) {
      // console.log("---authCheckState--- dispatch(logout)");
      dispatch(logout());
    } else {
      // const expirationDate = new Date(localStorage.getItem("expirationDate"));
      // console.log("---authCheckState--- expirationDate", expirationDate);
      // if (expirationDate <= new Date()) {
      //     dispatch(logout());
      // } else {
      dispatch(authSuccess(token));
      // dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())));
      // }
    }
  };
};
