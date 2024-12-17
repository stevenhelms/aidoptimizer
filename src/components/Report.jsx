import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "react-loader-spinner";
import { AnchorButton } from "@blueprintjs/core";

import styles from "./Report.module.css";
import * as fileActions from "../features/filesActions";
import * as predictionActions from "../store/actions/predictions";
import { IS_REPORTING, IS_LOADING } from "../store/actions/runtime";
import ReportModal from "./ReportModal";
import settings from "../constants/settings";
import { fetchFiles } from "../features/filesActions";

const File = (props) => {
  const userToken = useSelector((state) => state.auth.userToken);
  const dispatch = useDispatch();

  const getPrediction = async (id) => {
    console.log("clicked " + id);
    dispatch({ type: IS_LOADING, isLoading: true });

    try {
      dispatch(predictionActions.predict(id, userToken));
      dispatch({ type: IS_LOADING, isLoading: false });
      // Open Modal with Results
      dispatch({ type: IS_REPORTING, reporting: true });
      dispatch(fetchFiles({ token: userToken, fileType: props.module }));
    } catch (err) {
      // Throw err
    }
  };

  let download_url = "";
  if (props.predictions) {
    if (props.predictions.startsWith("/")) {
      download_url = settings.api_url + props.predictions;
    } else {
      download_url = props.predictions;
    }
  }
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
            href={download_url}
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
  const listItems = files?.map((file) => {
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
  const isLoading = useSelector((state) => state.runtime.isLoading);
  const userToken = useSelector((state) => state.auth.userToken);
  const files = useSelector((state) => state.files.allFiles);
  const reportType = props.module ? props.module : "aid";
  // console.log("reportType", reportType);
  // console.log("userToken", userToken);
  // console.log("files", files);

  const dispatch = useDispatch();

  const loadFiles = useCallback(async () => {
    // dispatch({ type: IS_LOADING, loading: true });
    try {
      dispatch(fetchFiles({ token: userToken, fileType: reportType })).then(
        (response) => {
          console.log("report fetchFiles response", response);
        }
      );
      // dispatch({ type: IS_LOADING, loading: false });
    } catch (err) {
      // Throw an error
    }
  }, [dispatch, userToken, reportType]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles, isLoading, userToken]);

  return (
    <div className={styles.container}>
      <div className={styles.report}>
        <h1 className={styles.reportTitle}>Previous Data Uploads</h1>
        <span>(click on the file name calculate predictions)</span>
        <div className={styles.reportContainer}>
          {isLoading ? (
            <div className={styles.reportLoader}>
              <Grid
                visible={true}
                height="100"
                width="100"
                color="#666666"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={{}}
                wrapperClass="grid-wrapper"
              />
              <p>Predicting Results...</p>
            </div>
          ) : (
            <div className={styles.reportInner}>
              <FileList files={files} token={userToken} module={reportType} />
              <ReportModal />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// export default Report;
export default Report;
