import React, { useEffect, useState, useCallback, useReducer } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button, InputGroup, Intent, Tooltip } from "@blueprintjs/core";
import { Grid } from "react-loader-spinner";
import classes from "./Auth.module.css";
import { userLogin } from "../../features/authActions";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
const FORM_UPDATE_INTENT = "FORM_UPDATE_INTENT";

const formReducer = (state, action) => {
  let updatedIntents = {};

  switch (action.type) {
    case FORM_INPUT_UPDATE:
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value,
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid,
      };
      updatedIntents = {
        ...state.inputIntents,
        [action.input]: action.intent,
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
        formIsValid: updatedFormIsValid,
        inputValidities: updatedValidities,
        inputValues: updatedValues,
        inputIntents: updatedIntents,
      };
    case FORM_UPDATE_INTENT:
      updatedIntents = {
        ...state.inputIntents,
        [action.input]: action.intent,
      };
      return {
        ...state,
        inputIntents: updatedIntents,
      };
    default:
      return state;
  }
};

const Auth = (props) => {
  const { isLoading, userToken } = useSelector((state) => state.auth);
  // const { isLoading: filesLoading } = useSelector((state) => state.files);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  //   const [disabled, setDisabled] = useState(false);

  //   const [emailIntent, setEmailIntent] = useState("none");
  //   const [passwordIntent, setPasswordIntent] = useState("none");

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    inputIntents: {
      email: "none",
      password: "none",
    },
    formIsValid: false,
  });

  let validationRules = {
    email: {
      required: true,
      isEmail: true,
    },
    password: {
      required: true,
      minLength: 6,
    },
  };

  const lockButton = // useCallback(() =>
    (
      <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`}>
        <Button
          icon={showPassword ? "unlock" : "lock"}
          intent={Intent.WARNING}
          minimal={true}
          onClick={() => setShowPassword(!showPassword)}
        />
      </Tooltip>
      // ),
      // [disabled, showPassword]
    );

  const checkValidity = (value, rules) => {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  };

  const inputChangedHandler = (event, controlName) => {
    // console.log(event.target.name);
    // console.log(event.target.value);
    let isValid = checkValidity(
      event.target.value,
      validationRules[controlName]
    );

    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      input: controlName,
      isValid: isValid,
      intent: isValid ? "primary" : "danger",
      value: event.target.value,
    });
  };

  const submitHandler = useCallback(
    (event) => {
      // console.log(state.controls);
      event.preventDefault();
      // console.log(formState);
      userLogin(formState.inputValues.email, formState.inputValues.password);
    },
    [props, formState] //state.controls.email.value, state.controls.password.value]
  );

  let errorMessage = null;
  if (props.error) {
    console.log(props.error);
    errorMessage = <p style={{ color: "red" }}>{props.error}</p>;

    if (props.errorField) {
      dispatchFormState({
        type: FORM_UPDATE_INTENT,
        input: props.errorField,
        intent: "danger",
      });
    }
  }

  useEffect(() => {
    if (userToken) {
      navigate("/optimizer");
    }
  }, [userToken, navigate]);

  const submitForm = (data) => {
    dispatch(userLogin(data));
  };

  return (
    <div className={classes.Auth}>
      <h3>Aid Optimizer Login</h3>
      {errorMessage}
      {isLoading ? (
        <Grid
          visible={true}
          height="100"
          width="100"
          color="#666666"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass="grid-wrapper"
        />
      ) : (
        // <form onSubmit={submitHandler}>
        <form onSubmit={handleSubmit(submitForm)}>
          <InputGroup
            className={classes.authInput}
            // disabled={disabled}
            large={true}
            placeholder="E-mail address..."
            type="email"
            key="email"
            name="email"
            intent={formState.inputIntents.email}
            onChange={(event) => inputChangedHandler(event, "email")}
            round={true}
            autoComplete="email"
          />
          <InputGroup
            className={classes.authInput}
            // disabled={disabled}
            large={true}
            placeholder="Enter your password..."
            rightElement={lockButton}
            type={showPassword ? "text" : "password"}
            key="password"
            name="password"
            intent={formState.inputIntents.password}
            onChange={(event) => inputChangedHandler(event, "password")}
            round={true}
            autoComplete="current-password"
          />
          <Button type="submit">Submit</Button>
        </form>
      )}
    </div>
  );
};

// const mapStateToProps = (state) => {
//   return {
//     isLoading: state.auth.isLoading,
//     error: state.auth.error,
//     errorField: state.auth.errorField,
//     isAuthenticated: state.auth.token !== null,
//     authRedirectPath: state.auth.authRedirectPath,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onAuth: (email, password) => dispatch(actions.auth(email, password)),
//     onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/")),
//   };
// };

export default Auth;
