import React, { Component, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import axios from "axios";

import { Container, Box } from "@mui/material";
import styled from "styled-components";

import settings from "../constants/settings";
import { fetchFiles } from "../features/filesActions";

const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isDragActive) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const MyContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const MyDropzone = ({ module = "aid" }) => {
  const token = useSelector((state) => state.auth.userToken);
  const dispatch = useDispatch();

  const postFile = useCallback(
    (data) => {
      const options = {
        headers: {
          Authorization: `Token ${token}`,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/x-www-form-urlencoded",
          "x-amz-acl": "public-read",
          "x-bioinformatix": "20210413",
        },
      };

      axios
        .post(settings.api_url + "/upload/?module=" + module, data, options)
        .then(async () => {
          dispatch(fetchFiles({ token: token, fileType: module }));
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    [dispatch, token, module]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      // setUploadStatus(true);

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          // Once the file is fully loaded, we then post it to the API

          // Test if this is a text file
          // Does it have a CSV ending?

          // const binaryStr = reader.result;
          // console.log(binaryStr);
          let filedata = new FormData();
          filedata.append("file", file);
          postFile(filedata);
        };
        reader.readAsText(file);
      });
    },
    [postFile]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop });

  return (
    <Box>
      <Box>
        <Container
          sx={{
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            padding: 2,
            border: 2,
            borderColor: (props) => getColor(props),
            borderStyle: "dashed",
            backgroundColor: "#fafafa",
            color: "#bdbdbd",
            transition: "border 0.24s ease-in-out",
            marginTop: 2,
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p>Drag and drop CSV data files here, or click to select files</p>
        </Container>
      </Box>
    </Box>
  );
};

class UploadForm extends Component {
  render() {
    return (
      <div className="App-container">
        <div className="App-uploadform">
          <MyDropzone module={this.props.module} />
        </div>
      </div>
    );
  }
}

export default UploadForm;
