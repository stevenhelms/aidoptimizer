import React, { Component } from "react";
import { connect } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

// import logo from "./logo.svg";
import "../../App.css";
import styles from "./AidOptimizer.module.css";
import BigHeader from "../../components/BigHeader";
import UploadForm from "../../components/UploadForm";
import Report from "../../components/Report";

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";
import axios from "../../axios-instance";

class AidOptimizer extends Component {
  render() {
    return (
      <div className={styles.container}>
        <BigHeader />
        <Tabs>
          <TabList>
            <Tab>Aid</Tab>
            <Tab>Attrition</Tab>
            <Tab>Default</Tab>
          </TabList>

          <TabPanel>
            <UploadForm module="aid" />
            <Report token={this.props.token} module="aid" />
          </TabPanel>
          <TabPanel>
            <UploadForm module="attrition" />
            <Report token={this.props.token} module="attrition" />
          </TabPanel>
          <TabPanel>
            <UploadForm module="fincdefault" />
            <Report token={this.props.token} module="fincdefault" />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetAuthRedirectPath: (path) =>
      dispatch(actions.setAuthRedirectPath(path)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(AidOptimizer, axios));
