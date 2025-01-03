import React, { useEffect, useCallback, useMemo, use } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  IconButton,
  Typography,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import { Grid } from "react-loader-spinner";

import styles from "./Report.module.css";
import * as predictionActions from "../store/actions/predictions";
import * as filesActions from "../features/filesActions";
import { IS_REPORTING, IS_LOADING } from "../store/actions/runtime";
import settings from "../constants/settings";
import { fetchFiles } from "../features/filesActions";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5733",
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#E0C2FF",
      light: "#F5EBFF",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#47008F",
    },
  },
});
// const useStyles = makeStyles((theme) => ({
//   evenItem: {
//     backgroundColor: "#c6b7ed",
//   },
//   oddItem: {
//     backgroundColor: "#d1a2d1",
//   },
// }));

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  fullScreen: true,
  // bgcolor: "background.paper",
  // border: "2px solid #000",
  // boxShadow: 24,
  // p: 1,
  // display: "block",
  alignItems: "center",
  justifyContent: "center",
};

const gridLoadingStyle = {
  display: "flex",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

const ReportDialog = ({ id, token, open, handleClose, file_name }) => {
  const filePredictions = useSelector((state) => state.files.filePredictions);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (open && id) {
  //     dispatch(filesActions.fetchPredictions({ id, token }));
  //     console.log("fetchPredictions called", id);
  //   }
  // }, [open, id, token, dispatch]);

  // const filePredictions_list = useMemo(() => {
  //   return filePredictions.map((file_blob) => JSON.parse(file_blob));
  // }, [filePredictions]);

  return (
    <Dialog
      id={"modal" + id}
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      // sx={modalStyle}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="dialog-title">
        Prediction Results
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
        <Typography>Predictions ready!</Typography>
        {/* <List className="reportlist">
          {filePredictions_list.map((fp) => (
            <ListItem key={fp.id}>
              <div className="report">
                <span style={{ flex: 2 }}>Applicant ID: {fp.id}</span>
                <span style={{ flex: 2, marginLeft: 5 }}>
                  Score: {fp.score}
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
  id: PropTypes.number,
  token: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

const MyFileIcon = ({ id, fileName, download }) => {
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

  return (
    <IconButton href={url} target="_blank" sx={{ color: "primary.main" }}>
      {download ? <FileDownloadIcon /> : <DescriptionIcon />}
    </IconButton>
  );
};
MyFileIcon.propTypes = {
  id: PropTypes.number,
  fileName: PropTypes.string,
  download: PropTypes.bool,
};

const File = (props) => {
  return (
    <>
      <Typography sx={{ flex: 1 }}>{props.name}</Typography>
      <Typography sx={{ flex: 2 }}>
        {new Date(props.createdAt).toLocaleString()}
      </Typography>
      <Typography sx={{ flex: 1 }}>{props.size} bytes</Typography>
      {props.predictions ? (
        <ListItemIcon sx={{ flex: 1, flexGrow: 3, marginLeft: "auto" }}>
          <MyFileIcon
            id={props.fileid}
            fileName={props.predictions}
            download={false}
          />
          <MyFileIcon
            id={props.fileid}
            fileName={props.predictions}
            download={true}
          />
        </ListItemIcon>
      ) : null}
      {props.message ? (
        <Typography sx={{ flex: 1, flexGrow: 3, color: "warning.dark" }}>
          {props.message}
        </Typography>
      ) : null}
      {!props.message && !props.predictions ? (
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
  predictions: PropTypes.string,
  message: PropTypes.string,
};

const FileLoading = ({ loading, len }) => {
  if (!loading && len === 0) {
    return (
      <Box sx={gridLoadingStyle}>
        <Typography variant="h5" sx={{ display: "block", color: "#999" }}>
          No files uploaded.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={gridLoadingStyle}>
      <Typography variant="h5" gutterBottom sx={{ display: "block" }}>
        Loading...
      </Typography>
      <Grid
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

const FileList = ({ files, token, module }) => {
  const isLoading = useSelector((state) => state.runtime.isLoading);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (id, token, prediction_file) => {
    console.log("handleClickOpen clicked " + id);
    if (prediction_file) {
      setOpen(true);
      console.log("handleClickOpen has predictions " + id);
    } else {
      getPrediction(id);
      console.log("handleClickOpen predicting " + id);
    }
  };

  const handleClose = () => {
    setOpen(false);
    dispatch({ type: IS_REPORTING, reporting: false });
  };

  const dispatch = useDispatch();

  const getPrediction = (id) => {
    console.log("clicked " + id);
    dispatch({ type: IS_LOADING, isLoading: true });

    try {
      dispatch(predictionActions.predict(id, token));
      dispatch({ type: IS_LOADING, isLoading: false });
      // Open Modal with Results
      dispatch({ type: IS_REPORTING, reporting: true });
      dispatch(fetchFiles({ token: token, fileType: props.module }));
    } catch (err) {
      // Throw err
    }
  };

  const files_list = useMemo(() => {
    return files.map((file_blob) => JSON.parse(file_blob));
  }, [files]);

  files_list.map((file) => {
    if (file.message) {
      console.log("File Error: ", file.name, file.message);
    }
  });

  return (
    <List className={styles.filelist}>
      {isLoading || files_list.length === 0 ? (
        <FileLoading loading={isLoading} len={files_list.length} />
      ) : (
        files_list.map((file, index) => (
          // <ListItemButton
          //   key={file.id}
          //   onClick={() =>
          //     handleClickOpen(file.id, token, file.prediction_file)
          //   }
          // >
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
              predictions={file.prediction_file}
              token={token}
              module={module}
            />
            {0 && file?.message ? (
              <Typography style={{ flex: 1, flexGrow: 3, color: "red" }}>
                {file.message}
              </Typography>
            ) : null}
          </ListItem>
          // </ListItemButton>
        ))
      )}
    </List>
  );
};
FileList.propTypes = {
  files: PropTypes.array,
  token: PropTypes.string,
  module: PropTypes.string,
};

const Report = (props) => {
  const isLoading = useSelector((state) => state.runtime.isLoading);
  const userToken = useSelector((state) => state.auth.userToken);
  const files = useSelector((state) => state.files.allFiles);
  const reportType = props.module ? props.module : "aid";

  const dispatch = useDispatch();

  const loadFiles = useCallback(async () => {
    dispatch({ type: IS_LOADING, loading: true });
    try {
      dispatch(fetchFiles({ token: userToken, fileType: reportType })).then(
        (response) => {
          console.log("report fetchFiles response", response);
        }
      );
    } catch (err) {
      // Throw an error
    }
    dispatch({ type: IS_LOADING, loading: false });
  }, [dispatch, userToken, reportType]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles, isLoading, userToken]);

  return (
    <Box className={styles.container}>
      <div className={styles.report}>
        <Typography variant="h5" gutterBottom className={styles.reportTitle}>
          Data Uploads
        </Typography>
        <div className={styles.reportContainer}>
          {isLoading ? (
            <div className={styles.reportLoader}>
              <Grid
                visible={true}
                height="50"
                width="50"
                color="#333333"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={gridLoadingStyle}
                wrapperClass="grid-wrapper"
              />
              <Typography variant="h5" gutterBottom sx={{ display: "block" }}>
                Predicting Results...
              </Typography>
            </div>
          ) : (
            <div className={styles.reportInner}>
              <FileList files={files} token={userToken} module={reportType} />
            </div>
          )}
        </div>
      </div>
    </Box>
  );
};

export default Report;
