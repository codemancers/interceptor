import * as React from "react";
import {InterceptTextBox} from "./InterceptTextBox";
import {RequestObj} from './../request_list'

export const InterceptForm = (props:RequestObj) => {
  return (
    <div>
      <InterceptTextBox
        rowProps={props.rowProps.row}
        handleRespTextChange={props.handleRespTextChange}
        responseText={props.responseText}
        handleStatusCodeChange={props.handleStatusCodeChange}
        statusCodes={props.statusCodes}
        handleContentTypeChange={props.handleContentTypeChange}
        contentType={props.contentType}
        tabId={props.tabId}
        fetchResponse={props.fetchResponse}
        responseData={props.responseData}
        responseError={props.responseError}
      />
    </div>
  );
};
