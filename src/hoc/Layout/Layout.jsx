import React from "react";
import { connect } from "react-redux";

import Aux from "../Aux/Aux";
import styles from "./Layout.module.css";

import Header from "../../components/Header";

const Layout = (props) => {
  return (
    <Aux>
      <Header />
      <main className={styles.Container}>{props.children}</main>
    </Aux>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

// export default connect(mapStateToProps)(Layout);
export default Layout;
