import React, { useEffect, useState, useCallback, useReducer } from "react";
import { useForm, Controller } from "react-hook-form";
import { redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";

// import { Button, InputGroup, Intent, Tooltip } from "@blueprintjs/core";

import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { Grid } from "react-loader-spinner";

import { userLogin } from "../../features/authActions";
import { loginSuccess, setCredentials } from "../../features/authSlice";

const gridLoadingStyle = {
  display: "flex",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

const Auth = (props) => {
  const { isLoading, userToken, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const csrftoken = cookies.get("csrftoken");

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (userToken) {
      redirect("/optimizer");
    }
  }, [userToken, redirect]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const submitForm = (data) => {
    console.log("submitForm", data);
    const rv = dispatch(userLogin(data)).then((response) => {
      console.log("dispatch userLogin response", response);
      // setCredentials(response);
      // if (response.payload.token) {
      //   // console.log("loginSuccess response", response);
      //   // loginSuccess(response);
      //   // userToken = response.payload.token;
      // }
      // return response;
    });
    console.log("submitForm rv", rv);
  };

  return (
    <Box
      component="section"
      sx={{
        p: 2,
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        noWrap
        component="a"
        href="#login"
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".3rem",
          color: "inherit",
          textDecoration: "none",
        }}
      >
        Login
      </Typography>

      {isLoading ? (
        <Grid
          visible={true}
          height="100"
          width="100"
          color="#666666"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={gridLoadingStyle}
          wrapperClass="grid-wrapper"
        />
      ) : (
        <form onSubmit={handleSubmit(submitForm)}>
          <input
            type="hidden"
            name="csrfmiddlewaretoken"
            value={csrftoken}
            {...register("csrfmiddlewaretoken")}
          />
          {error && <Error>{error}</Error>}
          <Box flex={1} sx={{ display: "flex", flexDirection: "column" }}>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                  <InputLabel htmlFor="outlined-username">
                    E-mail address
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-username"
                    {...field}
                    type="email"
                    name="username"
                    autoComplete="email"
                    required
                    label="E-mail address"
                  />
                </FormControl>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    {...field}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    required
                    label="Password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              )}
            />
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <Spinner /> : "Login"}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};

export default Auth;
