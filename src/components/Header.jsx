import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Alignment, Button } from "@blueprintjs/core";
import { NavLink } from "react-router";

import { useGetUserDetailsQuery } from "../app/services/authService";
import { logout, setCredentials } from "../features/authSlice";

import appLogo from "../assets/iaa-logo.png";

const Header = () => {
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
              className="bp3-minimal"
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
