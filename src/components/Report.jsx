import React, { useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import { Grid as GridSpinner } from "react-loader-spinner";

import styles from "./Report.module.css";
import * as runtime from "../features/runtimeSlice";
import settings from "../constants/settings";
import { fetchFiles, fetchPredictions } from "../features/filesActions";

const gridLoadingStyle = {
  display: "flex",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

const columns = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "score",
    headerName: "Score",
    width: 250,
  },
];

const ReportDialog = ({ token, open, handleClose }) => {
  const allFiles = useSelector((state) => state.files.allFiles);
  const filePredictions = useSelector((state) => state.files.filePredictions);
  const workingFile = useSelector((state) => state.runtime.workingFile);

  const filePredictions_list = useMemo(() => {
    return filePredictions.map((file_blob) => JSON.parse(file_blob));
  }, [filePredictions]);

  const workingFileData = useMemo(() => {
    const fileData = allFiles.find(
      (file) => JSON.parse(file).id === workingFile
    );
    return JSON.parse(
      fileData ? fileData : JSON.stringify({ name: "Unknown" })
    );
  }, [allFiles, workingFile]);

  return (
    <Dialog
      id="dialog-modal"
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      fullWidth={true}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="dialog-title">
        Prediction Results ({workingFileData.name})
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <DataGrid
          rows={filePredictions_list}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          // checkboxSelection
          disableRowSelectionOnClick
        />
        {/* <List className="reportlist">
          {filePredictions_list.map((fp) => (
            <ListItem key={fp.id}>
              <div className="report">
                <span style={{ flex: 2 }}>
                  <b>ID:</b> {fp.id}
                </span>
                <span style={{ flex: 2, marginLeft: 5 }}>
                  <b>Score:</b> {fp.score}
                </span>
              </div>
            </ListItem>
          ))}
        </List> */}
      </DialogContent>
    </Dialog>
  );
};
ReportDialog.propTypes = {
  token: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

const MyFileIcon = ({ id, fileName, download, onClick }) => {
  let url = "";
  if (!fileName) {
    return null;
  }

  if (!download && fileName.startsWith("/")) {
    url = settings.api_url + "/download/" + id + "/";
  } else if (download && fileName.startsWith("/")) {
    url = settings.api_url + fileName;
  } else {
    url = fileName;
  }

  if (!download) {
    return (
      <IconButton sx={{ color: "primary.main" }} onClick={onClick}>
        {download ? <FileDownloadIcon /> : <DescriptionIcon />}
      </IconButton>
    );
  }
  return (
    <IconButton href={url} sx={{ color: "primary.main" }}>
      {download ? <FileDownloadIcon /> : <DescriptionIcon />}
    </IconButton>
  );
};
MyFileIcon.propTypes = {
  id: PropTypes.number,
  fileName: PropTypes.string,
  download: PropTypes.bool,
  onClick: PropTypes.func,
};

const File = (props) => {
  const dispatch = useDispatch();

  const handleClickOpen = (id, token) => {
    console.log("File handleClickOpen", id);
    dispatch(runtime.setIsReporting(true));
    dispatch(runtime.setWorkingFile(id));
    dispatch(fetchPredictions({ id, token })).then((response) => {
      console.log("fetchPredictions response", response);
    });
  };

  const url = settings.api_url + "/download/" + props.fileid + "/source";

  return (
    <>
      <Typography sx={{ flex: 1 }}>
        <Link href={url}>{props.name}</Link>
      </Typography>
      <Typography sx={{ flex: 2 }}>
        {new Date(props.createdAt).toLocaleString()}
      </Typography>
      <Typography sx={{ flex: 1 }}>{props.size} bytes</Typography>
      {props.predictionFile ? (
        <ListItemIcon sx={{ flex: 1, flexGrow: 3, marginLeft: "auto" }}>
          <MyFileIcon
            id={props.fileid}
            fileName={props.predictionFile}
            download={false}
            onClick={() => handleClickOpen(props.fileid, props.token)}
          />
          <MyFileIcon
            id={props.fileid}
            fileName={props.predictionFile}
            download={true}
          />
        </ListItemIcon>
      ) : null}
      {props.message ? (
        <Typography sx={{ flex: 1, flexGrow: 3, color: "warning.dark" }}>
          {props.message}
        </Typography>
      ) : null}
      {!props.message && !props.predictionFile ? (
        <Box sx={{ flex: 1, flexGrow: 3 }}></Box>
      ) : null}
    </>
  );
};
File.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  createdAt: PropTypes.string,
  fileid: PropTypes.number,
  predictionFile: PropTypes.string,
  message: PropTypes.string,
  token: PropTypes.string,
};

const FileLoading = ({ loading, len }) => {
  if (!loading && len === 0) {
    return (
      <Box sx={gridLoadingStyle}>
        <Typography
          variant="h5"
          sx={{ display: "block", color: "primary.main" }}
        >
          No files uploaded.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={gridLoadingStyle}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ display: "block", color: "primary.main" }}
      >
        Loading...
      </Typography>
      <GridSpinner
        visible={true}
        height="50"
        width="50"
        color="primary.main"
        radius="12.5"
        ariaLabel="grid-loading"
        wrapperStyle={gridLoadingStyle}
      />
    </Box>
  );
};
FileLoading.propTypes = {
  loading: PropTypes.bool,
  len: PropTypes.number,
};

const FileList = ({ files, token, open, module }) => {
  const isLoading = useSelector((state) => state.runtime.isLoading);

  const files_list = useMemo(() => {
    return files.map((file_blob) => JSON.parse(file_blob));
  }, [files]);

  return (
    <List className={styles.filelist}>
      {isLoading || files_list.length === 0 ? (
        <FileLoading loading={isLoading} len={files_list.length} />
      ) : (
        files_list.map((file, index) => (
          <ListItem
            key={file.id}
            sx={
              index % 2 === 0
                ? { background: "transparent" }
                : { background: "#f9f9f9" }
            }
          >
            <File
              key={file.id}
              name={file.name}
              size={file.size}
              message={file.message}
              createdAt={file.created_at}
              fileid={file.id}
              predictionFile={file.prediction_file}
              token={token}
              module={module}
              open={open}
            />
          </ListItem>
        ))
      )}
    </List>
  );
};
FileList.propTypes = {
  files: PropTypes.array,
  token: PropTypes.string,
  module: PropTypes.string,
  open: PropTypes.bool,
};

const Report = (props) => {
  const isLoading = useSelector((state) => state.runtime.isLoading);
  const userToken = useSelector((state) => state.auth.userToken);
  const files = useSelector((state) => state.files.allFiles);
  const reporting = useSelector((state) => state.runtime.reporting);
  const reportType = props.module ? props.module : "aid";
  const dispatch = useDispatch();

  const handleClose = () => {
    console.log("Report handleClose");
    dispatch(runtime.setIsReporting(false));
  };

  const loadFiles = useCallback(async () => {
    dispatch(runtime.setIsLoading(true));
    try {
      dispatch(fetchFiles({ token: userToken, fileType: reportType })).then(
        (response) => {
          console.log("report fetchFiles response", response);
          dispatch(runtime.setIsLoading(false));
        }
      );
    } catch (err) {
      // Throw an error
    }
  }, [dispatch, userToken, reportType]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles, userToken]);

  return (
    <Box className={styles.container}>
      <div className={styles.report}>
        <Typography variant="h5" gutterBottom className={styles.reportTitle}>
          Data Uploads
        </Typography>
        <div className={styles.reportContainer}>
          {isLoading ? (
            <div className={styles.reportLoader}>
              <GridSpinner
                visible={true}
                height="50"
                width="50"
                color="primary.main"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={gridLoadingStyle}
                wrapperClass="grid-wrapper"
              />
              <Typography variant="h5" gutterBottom sx={{ display: "block" }}>
                Loading Files...
              </Typography>
            </div>
          ) : (
            <div className={styles.reportInner}>
              <FileList files={files} token={userToken} module={reportType} />
            </div>
          )}
        </div>
      </div>
      <ReportDialog
        token={userToken}
        open={reporting}
        handleClose={handleClose}
      />
    </Box>
  );
};

export default Report;
