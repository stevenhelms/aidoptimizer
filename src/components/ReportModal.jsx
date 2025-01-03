import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// import Modal from "react-modal";
// import {
//   AnchorButton,
//   Button,
//   Classes,
//   Dialog,
//   Intent,
// } from "@blueprintjs/core";

import settings from "../constants/settings";
import { IS_REPORTING } from "../store/actions/runtime";

// Modal.setAppElement(document.getElementById("root"));

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ReportModal = ({ id }) => {
  const reporting = useSelector((state) => state.runtime.reporting);
  const filename = useSelector((state) => state.predictions.file);
  const predictions = useSelector((state) => state.predictions.predictions);

  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch({ type: IS_REPORTING, reporting: false });
  };

  return (
    <Modal
      open={reporting}
      onClose={closeModal}
      aria-labelledby="Aid Optimization Report"
      aria-describedby="Report Item"
    >
      <Box sx={modalStyle}>
        <Typography id="Aid Optimization Report" variant="h6" component="h2">
          Results
        </Typography>

        <List className="reportlist" id={"list" + id}>
          {predictions.map((pred) => (
            <ListItem key={pred.id}>
              <div className="report">
                <span style={{ flex: 2 }}>Applicant ID: {pred.id}</span>
                <span style={{ flex: 1, marginLeft: 20 }}>
                  Score: {pred.score}
                </span>
              </div>
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
  
};

export default ReportModal;
