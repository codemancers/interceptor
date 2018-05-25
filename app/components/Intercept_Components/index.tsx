import * as React from "react";
import { InterceptTextBox } from "./InterceptTextBox";
import { RequestObj } from "./../RequestList";

export const InterceptForm: React.SFC<RequestObj> = props => {
  return (
    <div>
      <InterceptTextBox
        data={props.data}
        rowProps={props.rowProps.row}
        handleRespTextChange={props.handleRespTextChange}
        handleStatusCodeChange={props.handleStatusCodeChange}
        handleContentTypeChange={props.handleContentTypeChange}
        currentTabId={props.currentTabId}
        fetchResponse={props.fetchResponse}
      />
    </div>
  );
};
