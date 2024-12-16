import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import "react-tabs/style/react-tabs.css";
import "../../App.css";
import styles from "./AidOptimizer.module.css";
import UploadForm from "../../components/UploadForm";
import Report from "../../components/Report";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-instance";

function UploadTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

UploadTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `upload-tab-${index}`,
    "aria-controls": `upload-tabpanel-${index}`,
  };
}

const AidOptimizer = (props) => {
  const { userToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!userToken) {
      navigate("/auth");
    }
  }, [userToken, navigate]);

  return (
    <Box sx={{ flexGrow: 1, mt: 2, mb: 2, mx: "auto", maxWidth: "80%" }}>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="data upload tabs"
        >
          <Tab label="Aid (2021)" {...a11yProps(0)} />
          <Tab label="Aid (2024)" {...a11yProps(1)} />
          <Tab label="Attrition" {...a11yProps(2)} />
          <Tab label="Financial Default" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <UploadTabPanel value={value} index={0}>
        <Box>
          Uploads for financial aid prediction must be in CSV format. Please
          download the template below to ensure your data is in the correct
          format. <a href="/aid-template.csv">Download Template</a>
        </Box>
        <UploadForm module="aid" />
        <Report token={userToken} module="aid" />
      </UploadTabPanel>
      <UploadTabPanel value={value} index={1}>
        <UploadForm module="aid2024" />
        <Report token={userToken} module="aid2024" />
      </UploadTabPanel>
      <UploadTabPanel value={value} index={2}>
        <Box>
          Uploads for attrition prediction must be in CSV format. Please
          download the template below to ensure your data is in the correct
          format. <a href="/attrition-template.csv">Download Template</a>
        </Box>
        <UploadForm module="attrition" />
        <Report token={userToken} module="attrition" />
      </UploadTabPanel>
      <UploadTabPanel value={value} index={3}>
        <Box>
          Uploads for financial default prediction must be in CSV format. Please
          download the template below to ensure your data is in the correct
          format. <a href="/default-template.csv">Download Template</a>
        </Box>
        <UploadForm module="fincdefault" />
        <Report token={userToken} module="fincdefault" />
      </UploadTabPanel>
    </Box>
  );
};

export default withErrorHandler(AidOptimizer, axios);
