import * as React from "react";
import {RequestHeaderList} from "./RequestHeaderList";

export const InterceptTextBox = props => {
  const defaultResponseText = "";
  const defaultStatusCode = "200";
  const defaultContentType = "application/json";
  const responseTextValue = props.responseText[props.rowProps.checkbox.requestId] || defaultResponseText;
  const statusCodeValue = props.statusCodes[props.rowProps.checkbox.requestId] || defaultStatusCode;
  const contentTypeValue = props.contentType[props.rowProps.checkbox.requestId] || defaultContentType;

  return (
    <div className="grid-container form">
      <div className="full-url">
        <label htmlFor="">URL</label>
        <a href={props.rowProps.checkbox.url} className="urlText">
          {props.rowProps.checkbox.url}
        </a>
      </div>
      <div className="response">
        <label htmlFor="">Response Text</label>
        <textarea
          name="responseText"
          className="responseText"
          defaultValue={responseTextValue}
          //value={responseTextValue}
          onChange={event => props.handleRespTextChange(event.target.value, props.rowProps.checkbox.requestId)}
        />
      </div>
      <div className="status">
        <label htmlFor="">Select Status</label>
        <select
          value={statusCodeValue}
          className="select-status"
          onChange={event => {
            props.handleStatusCodeChange(event.target.value, props.rowProps.checkbox.requestId);
          }}
        >
          <option value="200">OK</option>
          <option value="404">404</option>
          <option value="500">500</option>
          <option value="300">300</option>
        </select>
      </div>
      <div className="content">
        <label htmlFor="">Content Type</label>
        <select
          value={contentTypeValue}
          className="content-type-select"
          onChange={event => {
            props.handleContentTypeChange(event.target.value, props.rowProps.checkbox.requestId);
          }}
        >
          <option value="application/json">application/json</option>
          <option value="text/html">text/html</option>
          <option value="text/csv">text/csv</option>
          <option value="application/javascript">application/javascript</option>
          <option value="text/css">text/css</option>
          <option value="text/plain">text/plain</option>
          <option value="application/pdf">application/pdf</option>
        </select>
      </div>
      <RequestHeaderList requestHeaders={props.rowProps.checkbox.requestHeaders} />
    </div>
  );
};

InterceptTextBox.defaultProps = {
  responseText: [],
  statusCodes: [],
  contentType: []
};
