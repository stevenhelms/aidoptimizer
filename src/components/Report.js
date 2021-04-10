import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { connect } from "react-redux";
import ActivityIndicator from "react-loader-spinner";
import { AnchorButton } from "@blueprintjs/core";

import styles from "./Report.module.css";
import * as fileActions from "../store/actions/files";
import * as predictionActions from "../store/actions/predictions";
import { IS_REPORTING, IS_LOADING } from "../store/actions/runtime";
import ReportModal from "./ReportModal";

const File = (props) => {
  const dispatch = useDispatch();

  const getPrediction = async (id) => {
    console.log("clicked " + id);
    dispatch({ type: IS_LOADING, loading: true });

    try {
      await dispatch(predictionActions.predict(id, props.token));
      dispatch({ type: IS_LOADING, loading: false });
      // Open Modal with Results
      dispatch({ type: IS_REPORTING, reporting: true });
      await dispatch(fileActions.fetchFiles(props.token, props.module));
    } catch (err) {
      // Throw err
    }
  };

  return (
    <div className={styles.file}>
      <span
        className={styles.fileClick}
        onClick={() => {
          getPrediction(props.fileid);
        }}
        style={{ flex: 1 }}
      >
        {props.name}
        <br />
        {props.createdAt}
      </span>
      {props.predictions ? (
        <span style={{ flex: 2, alignContent: "right", textAlign: "right" }}>
          <AnchorButton
            icon="download"
            // intent={Intent.PRIMARY}
            href={props.predictions}
            target="_blank"
            small={true}
          >
            Download Scores
          </AnchorButton>
        </span>
      ) : null}
    </div>
  );
};

const FileList = (props) => {
  const files = props.files;
  const listItems = files.map((file) => {
    // console.log(file);
    return (
      <li key={`file_${file.id}`}>
        <File
          name={file.name}
          size={file.size}
          createdAt={file.created_at}
          fileid={file.id}
          predictions={file.prediction_file}
          token={props.token}
          module={props.module}
        />
      </li>
    );
  });
  return <ul className={styles.filelist}>{listItems}</ul>;
};

const Report = (props) => {
  const isLoading = useSelector((state) => state.runtime.loading);
  const reportType = props.module ? props.module : "aid";

  const files = useSelector((state) => state.files.allFiles);

  const dispatch = useDispatch();

  const loadFiles = useCallback(async () => {
    dispatch({ type: IS_LOADING, loading: true });
    try {
      await dispatch(fileActions.fetchFiles(props.token, reportType));
      dispatch({ type: IS_LOADING, loading: false });
    } catch (err) {
      // Throw an error
    }
  }, [dispatch, props.token, reportType]);

  useEffect(() => {
    loadFiles();
  }, [dispatch, loadFiles]);

  return (
    <div className={styles.container}>
      <div className={styles.report}>
        <h1 className={styles.reportTitle}>Previous Data Uploads</h1>
        <span>(click to file name calculate predictions)</span>
        <div className={styles.reportContainer}>
          {isLoading ? (
            <div className={styles.reportLoader}>
              <ActivityIndicator
                type="Grid"
                color="#666666"
                height={100}
                width={100}
                // timeout={3000} //3 secs
              />
              <p>Predicting Results...</p>
            </div>
          ) : (
            <div className={styles.reportInner}>
              <FileList
                files={files}
                token={props.token}
                module={props.module}
              />
              <ReportModal />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    token: state.auth.token,
  };
};

// export default Report;
export default connect(mapStateToProps)(Report);
