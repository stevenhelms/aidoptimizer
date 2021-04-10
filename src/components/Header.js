import React from "react";
import { Navbar, Alignment, Button } from "@blueprintjs/core";
import { NavLink } from "react-router-dom";

import appLogo from '../assets/iaa-logo.png';

const Header = (props) => {
  return (
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading><img src={appLogo} alt="Interlochen Arts Academy" style={{ height: 36 }} /></Navbar.Heading>
        <Navbar.Divider />
        {props.isAuth ? <NavLink to="/" exact>
          <Button className="bp3-minimal" icon="home" text="Home" />
        </NavLink> : null }
        {props.isAuth ? <NavLink to="/logout">
        <Button className="bp3-minimal" icon="log-out" text="Logout" />
      </NavLink> : null }
      </Navbar.Group>
    </Navbar>
  );
};

export default Header;
