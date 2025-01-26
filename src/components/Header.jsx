import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, redirect, useNavigate } from "react-router";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { useGetUserDetailsQuery } from "../app/services/authService";
import { logout, setCredentials } from "../features/authSlice";

import appLogo from "../assets/ica-logo.svg";
import appIcon from "../assets/ica-icon.svg";

const Header = () => {
  const { userToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // automatically authenticate user if token is found
  const { data, isFetching } = useGetUserDetailsQuery("userDetails", {
    pollingInterval: 900000, // 15mins
  });

  let pages = { Home: "/", Login: "auth/" };
  if (!isFetching && userToken !== null) {
    pages = { Home: "/", Logout: "/logout" };
  }

  useEffect(() => {
    if (userToken !== null) {
      navigate("/optimizer");
    }
  }, [userToken]);

  useEffect(() => {
    if (data) {
      dispatch(setCredentials(data));
    }
  }, [data, dispatch]);

  return (
    <AppBar position="static" color="transparent">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img
            src={appLogo}
            alt="Interlochen Center for the Arts"
            style={{ height: 73, padding: 5 }}
          />
          {/* {!isFetching && userToken !== null ? (
          <NavLink to="/">Home</NavLink>
        ) : null}
        {!isFetching && userToken !== null ? (
          <NavLink to="/logout">
            <Button
              icon="log-out"
              text="Logout"
              onClick={() => dispatch(logout())}
            />
          </NavLink>
        ) : (
          <NavLink className="button" to="/login">
            Login
          </NavLink>
        )} */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button underline="hover">
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <Typography sx={{ textAlign: "center" }}>Home</Typography>
              </NavLink>
            </Button>
            {userToken !== null ? (
              <Button underline="hover" onClick={() => dispatch(logout())}>
                <Typography sx={{ textAlign: "center" }}>Logout</Typography>
              </Button>
            ) : null}
            {/* {Object.entries(pages).map(([page, path]) => (
              <Button href={path} underline="hover" key={page}>
                <Typography sx={{ textAlign: "center" }}>{page}</Typography>
              </Button>
            ))} */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const HeaderOld = () => {
  const { userToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // automatically authenticate user if token is found
  const { data, isFetching } = useGetUserDetailsQuery("userDetails", {
    pollingInterval: 900000, // 15mins
  });

  useEffect(() => {
    if (data) dispatch(setCredentials(data));
  }, [data, dispatch]);

  return (
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>
          <img
            src={appLogo}
            alt="Interlochen Arts Academy"
            style={{ height: 36 }}
          />
        </Navbar.Heading>
        <Navbar.Divider />
        {!isFetching && userToken !== null ? (
          <NavLink to="/">Home</NavLink>
        ) : null}
        {!isFetching && userToken !== null ? (
          <NavLink to="/logout">
            <Button
              icon="log-out"
              text="Logout"
              onClick={() => dispatch(logout())}
            />
          </NavLink>
        ) : (
          <NavLink className="button" to="/login">
            Login
          </NavLink>
        )}
      </Navbar.Group>
    </Navbar>
  );
};

export default Header;
