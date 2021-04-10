import React from "react";
import { Navbar, Button, Alignment } from "@blueprintjs/core";
import { NavLink } from "react-router-dom";

import styles from "./Toolbar.module.css";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import DrawerToggle from "../SideDrawer/DrawerToggle/DrawerToggle";

const Toolbar = (props) => {
  return (
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>Aid Optimizer</Navbar.Heading>
        <Navbar.Divider />
        <NavLink to="/" exact>
          <Button className="bp3-minimal" icon="home" text="Home" />
        </NavLink>
        <NavLink to="/auth">
          <Button className="bp3-minimal" icon="login" text="Login" />
        </NavLink>
      </Navbar.Group>
    </Navbar>
  );
  return (
    <header className={styles.Toolbar}>
      <DrawerToggle clicked={props.drawerToggleClicked} />
      <div className={styles.Logo}>
        <Logo />
      </div>
      <nav className={styles.DesktopOnly}>
        <NavigationItems isAuthenticated={props.isAuth} />
      </nav>
    </header>
  );
};

export default Toolbar;
