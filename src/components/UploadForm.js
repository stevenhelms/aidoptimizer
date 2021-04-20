import React, { Component, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import styled from "styled-components";

import settings from "../constants/settings";
import * as fileActions from "../store/actions/files";

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

const Container = styled.div`
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

const Dropzone = ({ module = "aid" }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  console.log("Dropzone module", module);
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
          await dispatch(fileActions.fetchFiles(token, module));
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
    <div className="container">
      <Container
        {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop CSV data files here, or click to select files</p>
      </Container>
    </div>
  );
};

class UploadForm extends Component {
  render() {
    return (
      <div className="App-container">
        <div className="App-uploadform">
          <p>
            Choose a CSV file to upload. Please note the uploads must comply
            with a specific format for the predictors to run properly. You may
            use one of the following templates:
            <ul>
              <li>
                <a href="aid-template.csv">Aid Optimizer</a>
              </li>
              <li>
                <a href="default-template.csv">Default Predictor</a>
              </li>
              <li>
                <a href="attrition-template.csv">Attrition Predictor</a>
              </li>
            </ul>
          </p>
          <Dropzone module={this.props.module} />
        </div>
      </div>
    );
  }
}

export default UploadForm;
