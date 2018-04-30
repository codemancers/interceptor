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
          <option value="100">001</option>
          <option value="101">101</option>
          <option value="200">200</option>
          <option value="201">201</option>
          <option value="202">202</option>
          <option value="203">203</option>
          <option value="204">204</option>
          <option value="205">205</option>
          <option value="206">206</option>
          <option value="207">207</option>
          <option value="300">300</option>
          <option value="301">301</option>
          <option value="302">302</option>
          <option value="303">303</option>
          <option value="304">304</option>
          <option value="305">305</option>
          <option value="306">306</option>
          <option value="307">307</option>
          <option value="400">400</option>
          <option value="401">401</option>
          <option value="402">402</option>
          <option value="403">403</option>
          <option value="404">404</option>
          <option value="405">405</option>
          <option value="406">406</option>
          <option value="407">407</option>
          <option value="408">408</option>
          <option value="409">409</option>
          <option value="410">410</option>
          <option value="411">411</option>
          <option value="412">412</option>
          <option value="413">413</option>
          <option value="414">414</option>
          <option value="415">415</option>
          <option value="416">416</option>
          <option value="417">417</option>
          <option value="422">422</option>
          <option value="500">500</option>
          <option value="501">501</option>
          <option value="502">502</option>
          <option value="503">503</option>
          <option value="504">504</option>
          <option value="505">505</option>
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
