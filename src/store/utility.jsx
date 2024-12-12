import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};


export const withRouter = (Component) => {

  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
        // location={location}
        // params={params}
        // navigate={navigate}
      />
    );
  }

  return ComponentWithRouterProp;
}
