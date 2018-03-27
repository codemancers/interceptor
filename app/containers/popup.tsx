import * as React from "react";
import * as cx from "classnames";
import {connect} from "react-redux";

import * as MessageService from "./../message_service";
import RequestList from "./../components/request_list";
import {POPUP_PROPS} from "./../types";
import * as actionTypes from "./../actions";

interface DispatchProps {
  startListening: typeof actionTypes.startListening;
  stopListening: typeof actionTypes.stopListening;
  errorNotify: typeof actionTypes.errorNotify;
  updateField: typeof actionTypes.updateField;
  clearFields: typeof actionTypes.clearFields;
  updateFields: typeof actionTypes.updateFields;
  handleCheckToggle: typeof actionTypes.handleCheckToggle;
  handleCheckedRequests: typeof actionTypes.handleCheckedRequests;
  handleRespTextChange: typeof actionTypes.handleRespTextChange;
  handleStatusCodeChange: typeof actionTypes.handleStatusCodeChange;
  handleContentTypeChange: typeof actionTypes.handleContentTypeChange;
  handlePaginationChange: typeof actionTypes.handlePaginationChange
}

const CHROME_URL_REGEX = /^chrome:\/\/.+$/;

const isChromeUrl = (url: string) => {
  return CHROME_URL_REGEX.test(url);
};

export class Popup extends React.Component<POPUP_PROPS & DispatchProps, {}> {
  componentWillMount() {
    this.props.updateField("interceptStatus", "");
    this.props.updateField("tabId", this.props.tabId);
    this.props.updateField("tabUrl", this.props.tabUrl);
    MessageService.getRequests(this.props.tabId, requests => {
      this.props.updateField("requests", requests);
    });

    MessageService.getEnabledStatus(this.props.tabId, (enabledStatus:boolean) =>{
      this.props.updateField("enabled", enabledStatus)
    })
      this.props.updateField("errorMessage", "");
  }

  isUrlInValid = (tabUrl: string) => {
    return !tabUrl || isChromeUrl(tabUrl);
  };

  handleClick = (_: React.MouseEvent<HTMLButtonElement>): void => {
    if (this.isUrlInValid(this.props.tabUrl)) {
      this.props.errorNotify(`Cannot Start Listening on ${this.props.tabUrl}`);
      return;
    }
    if (this.props.enabled) {
      MessageService.disableLogging(this.props.tabUrl, this.props.tabId);
      this.props.updateField("enabled", false);
    } else {
      MessageService.getRequests(this.props.tabId, requests => {
        MessageService.enableLogging(this.props.tabUrl, this.props.tabId);
        this.props.updateFields({enabled: true, requests});
      });
    }
  };

  clearRequests = (_: React.MouseEvent<HTMLButtonElement>): void => {
    MessageService.clearData(this.props.tabId);
    this.props.clearFields();
  };

  handleCheckToggle = (reqId: number, presentCheckedState: boolean) => {
    this.props.handleCheckToggle(reqId, presentCheckedState);
  };

  handleRespTextChange = (value: string, requestId: number) => {
    this.props.handleRespTextChange(value, requestId);
  };

  handleStatusCodeChange = (value: string, requestId: number) => {
    this.props.handleStatusCodeChange(value, requestId);
  };

  handleContentTypeChange = (value: string, requestId: number) => {
    this.props.handleContentTypeChange(value, requestId);
  };

  handleCheckedRequests = (requests: Array<object>) => {
    MessageService.interceptChecked(
      this.props.tabId,
      requests,
      this.props.responseText,
      this.props.statusCodes,
      this.props.contentType
    );
  };

  handlePaginationChange = (newPageNo_rowSize:string, tabId : number, field:string) => {
    this.props.handlePaginationChange(newPageNo_rowSize, tabId, field)
  }

  render() {
    const buttonClass = cx("button", {
      "button-start-listening": !this.props.enabled,
      "button-stop-listening": this.props.enabled
    });
    return (
      <div className="popup">
        {this.props.errorMessage ? <p className="popup-error-message popup-error"> {this.props.errorMessage} </p> : null}
        <button type="button" onClick={this.handleClick} className={buttonClass}>
          {this.props.enabled ? "Stop Listening" : "Start Listening"}
        </button>
        <button type="button" onClick={this.clearRequests} className="btn-clear">
          CLEAR
        </button>
        {this.props.interceptStatus && <div id="success-msg">{this.props.interceptStatus}</div>}
        <RequestList
          requests={this.props.requests}
          handleCheckToggle={this.handleCheckToggle}
          checkedReqs={this.props.checkedReqs}
          handleCheckedRequests={this.handleCheckedRequests}
          handleRespTextChange={this.handleRespTextChange}
          handleStatusCodeChange={this.handleStatusCodeChange}
          responseText={this.props.responseText}
          statusCodes={this.props.statusCodes}
          handleContentTypeChange={this.props.handleContentTypeChange}
          contentType={this.props.contentType}
          handlePaginationChange = {this.props.handlePaginationChange}
          PageDetails = {this.props.PageDetails}
          tabId = {this.props.tabId}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: POPUP_PROPS) => ({
  enabled: state.enabled,
  requests: state.requests,
  errorMessage: state.errorMessage,
  checkedReqs: state.checkedReqs,
  responseText: state.responseText,
  statusCodes: state.statusCodes,
  contentType: state.contentType,
  PageDetails : state.PageDetails,
  interceptStatus: state.interceptStatus
});

const mapDispatchToProps: DispatchProps = {
  startListening : actionTypes.startListening,
  stopListening : actionTypes.stopListening,
  errorNotify : actionTypes.errorNotify,
  updateField : actionTypes.updateField,
  updateFields : actionTypes.updateFields,
  clearFields : actionTypes.clearFields,
  handleCheckToggle : actionTypes.handleCheckToggle,
  handleCheckedRequests : actionTypes.handleCheckedRequests,
  handleStatusCodeChange : actionTypes.handleStatusCodeChange,
  handleRespTextChange : actionTypes.handleRespTextChange,
  handleContentTypeChange : actionTypes.handleContentTypeChange,
  handlePaginationChange : actionTypes.handlePaginationChange
};

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
