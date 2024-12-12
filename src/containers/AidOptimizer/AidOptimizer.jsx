import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

// import logo from "./logo.svg";
import "../../App.css";
import styles from "./AidOptimizer.module.css";
import BigHeader from "../../components/BigHeader";
import UploadForm from "../../components/UploadForm";
import Report from "../../components/Report";

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-instance";

const AidOptimizer = (props) => {
  const { userInfo, userToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate("/auth");
    }
  }, [userToken, navigate]);

  return (
    <div className={styles.container}>
      <BigHeader />
      <Tabs>
        <TabList>
          <Tab>Aid</Tab>
          <Tab>Aid 2024</Tab>
          <Tab>Attrition</Tab>
          <Tab>Default</Tab>
        </TabList>

        <TabPanel>
          <UploadForm module="aid" />
          <Report token={props.token} module="aid" />
        </TabPanel>
        <TabPanel>
          <UploadForm module="aid2024" />
          <Report token={props.token} module="aid2024" />
        </TabPanel>
        <TabPanel>
          <UploadForm module="attrition" />
          <Report token={props.token} module="attrition" />
        </TabPanel>
        <TabPanel>
          <UploadForm module="fincdefault" />
          <Report token={props.token} module="fincdefault" />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default withErrorHandler(AidOptimizer, axios);
