import React, { useEffect } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Layout from "./hoc/Layout/Layout";
import AidOptimizer from "./containers/AidOptimizer/AidOptimizer";
import Auth from "./containers/Auth/Auth";
import Logout from "./containers/Auth/Logout/Logout";
import * as actions from "./store/actions/index";

const App = (props) => {
  useEffect( () => {
    props.onTryAutoSignup();
  });
  
  let routes = (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Redirect path="*" to="/auth" />
    </Switch>
  );

  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/logout" component={Logout} />
        <Route exact path="/" component={AidOptimizer} />
        <Redirect path="*" to="/" />
      </Switch>
    );
  }

  console.log("App.js isAuth: "+ props.isAuthenticated);
  // console.log('App.js token: ' + props.token);
  return (
    <div>
      <Layout>{routes}</Layout>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
