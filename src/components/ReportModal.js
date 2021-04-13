import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import {
  AnchorButton,
  Button,
  Classes,
  Dialog,
  Intent,
} from "@blueprintjs/core";

import settings from "../constants/settings";
import { IS_REPORTING } from "../store/actions/runtime";

Modal.setAppElement(document.getElementById("root"));

const ReportList = (props) => {
  const predictions = useSelector((state) => state.predictions.predictions);
  // console.log(predictions);

  const reportItems = predictions.map((pred, idx) => {
    // console.log(pred);
    return (
      <li key={idx}>
        <div className="report">
          <span style={{ flex: 2 }}>Applicant ID: {pred.id}</span>
          <span style={{ flex: 1, marginLeft: 20 }}>Score: {pred.score}</span>
        </div>
      </li>
    );
  });

  return <ul className="reportlist">{reportItems}</ul>;
};

const ReportModal = (props) => {
  const reporting = useSelector((state) => state.runtime.reporting);
  const filename = useSelector((state) => state.predictions.file);

  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch({ type: IS_REPORTING, reporting: false });
  };

  const customStyles = {
    content: {
      top: "10%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -10%)",
      width: "60%",
    },
  };

  return (
    <Dialog
      isOpen={reporting}
      onClose={closeModal}
      style={customStyles}
      title="Aid Optimization Report"
      icon="info-sign"
    >
      {/* <h2>
        Aid Optimization Report
      </h2> */}
      {/* <div>Generated from: {fileinfo.name} on {fileinfo.date}</div> */}
      <div className={Classes.DIALOG_BODY}>
        <ReportList />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <AnchorButton
            intent={Intent.PRIMARY}
            href={settings.media_url + filename}
            target="_blank"
          >
            Download
          </AnchorButton>
          <Button onClick={closeModal} text="Close" rightIcon="cross" />
        </div>
      </div>
    </Dialog>
  );
};

export default ReportModal;
