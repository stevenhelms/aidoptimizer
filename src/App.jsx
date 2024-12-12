import React, { createContext, useEffect } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router";
import { connect, useSelector } from "react-redux";

import Layout from "./hoc/Layout/Layout";
import AidOptimizer from "./containers/AidOptimizer/AidOptimizer";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./containers/Auth/Auth";
import Logout from "./containers/Auth/Logout/Logout";

import "./index.css";
import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";

const App = (props) => {
  // useEffect( () => {
  //   props.onTryAutoSignup();
  // });

  /* let routes = (
    <Routes>
      <Route path="/auth" component={Auth} />
      <Route path="/logout" component={Logout} />
      <Route path="*" to="/auth" />
      <Route exact path="/" component={AidOptimizer} />
    </Routes>
  );

  if (props.isAuthenticated) {
    routes = (
      <Routes>
        <Route path="/auth" component={Auth} />
        <Route path="/logout" component={Logout} />
        <Route element={<ProtectedRoute />}>
            <Route path='/' element={<AidOptimizer />} />
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    );
  }
  */

  console.log("App.js isAuth: " + props.isAuthenticated);
  // console.log('App.js token: ' + props.token);
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" exact={true} element={<AidOptimizer />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/logout" component={<Logout />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/optimizer" element={<AidOptimizer />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
