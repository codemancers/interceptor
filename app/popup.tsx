import * as React from "react";
import * as cx from "classnames";
import {connect} from "react-redux";

import * as MessageService from "./message_service";
import RequestList from "./request_list";
import {POPUP_PROPS} from "./types";
import {
  startListening,
  stopListening,
  errorNotify,
  updateField,
  clearFields,
  updateFields,
  handleCheckToggle,
  handleCheckedRequests,
  handleRespTextChange,
  handleStatusCodeChange
} from "./actions";

interface DispatchProps {
  startListening: typeof startListening;
  stopListening: typeof stopListening;
  errorNotify: typeof errorNotify;
  updateField: typeof updateField;
  clearFields: typeof clearFields;
  updateFields: typeof updateFields;
  handleCheckToggle: typeof handleCheckToggle
  handleCheckedRequests : typeof handleCheckedRequests;
  handleRespTextChange : typeof handleRespTextChange;
  handleStatusCodeChange : typeof handleStatusCodeChange
}

const CHROME_URL_REGEX = /^chrome:\/\/.+$/;

const isChromeUrl = (url: string) => {
  return CHROME_URL_REGEX.test(url);
};

export class Popup extends React.Component<POPUP_PROPS & DispatchProps, {}> {
  componentWillMount() {
    MessageService.getRequests(this.props.tabId, requests => {
      this.props.updateField("requests", requests);
    });
  }

  isUrlInValid = (tabUrl: string) => {
    return !tabUrl || isChromeUrl(tabUrl);
  };

  interceptRequests = (
    url: string,
    method: string,
    responseText: string,
    statusCode: number
  ) => {
    let request = {url, method, responseText, statusCode};
    MessageService.interceptRequests(this.props.tabId, request);
  };

  handleClick = (_: React.MouseEvent<HTMLButtonElement>): void => {
    if (this.props.enabled) {
      MessageService.disableLogging(this.props.tabUrl, this.props.tabId);
      this.props.updateField("enabled", false);
    } else {
      MessageService.getRequests(this.props.tabId, requests => {
        MessageService.enableLogging(this.props.tabUrl, this.props.tabId);
        this.props.updateFields({enabled: true, requests});
      });
    }

    if (this.isUrlInValid(this.props.tabUrl)) {
      this.props.errorNotify(`Cannot Start Listening on ${this.props.tabUrl}`);
      return;
    }
  };

  clearRequests = (_: React.MouseEvent<HTMLButtonElement>): void => {
    MessageService.clearData(this.props.tabId);
    this.props.clearFields();
  };

  handleCheckToggle = (reqId:number, presentCheckedState:boolean) => {
    this.props.handleCheckToggle(reqId, presentCheckedState)
  };

  handleRespTextChange = (value, rowIndex) =>{
    this.props.handleRespTextChange(value, rowIndex)
  }

  handleStatusCodeChange = (value, rowIndex) => {
    this.props.handleStatusCodeChange(value, rowIndex)
  }

  handleCheckedRequests = (requests:Array<any>) =>{
    MessageService.interceptChecked(this.props.tabId, requests, this.props.ResponseText, this.props.interceptStatus)
  }

  render() {
    const buttonClass = cx("button", {
      "button-start-listening": !this.props.enabled,
      "button-stop-listening": this.props.enabled
    });
    return (
      <div className="popup">
        {this.props.errorMessage ? (
          <p className="popup-error-message popup-error">
            {" "}
            {this.props.errorMessage}{" "}
          </p>
        ) : null}
        <button
          type="button"
          onClick={this.handleClick}
          className={buttonClass}
        >
          {this.props.enabled ? "Stop Listening" : "Start Listening"}
        </button>
        <button
          type="button"
          onClick={this.clearRequests}
          className="btn-clear"
        >
          CLEAR
        </button>
        <RequestList
          requests={this.props.requests}
          handleIntercept={this.interceptRequests}
          handleCheckToggle={this.handleCheckToggle}
          checkedReqs={this.props.checkedReqs}
          handleCheckedRequests={this.handleCheckedRequests}
          handleRespTextChange={this.handleRespTextChange}
          handleStatusCodeChange={this.handleStatusCodeChange}
          ResponseText={this.props.ResponseText}
          interceptStatus={this.props.interceptStatus}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: POPUP_PROPS) => ({
  enabled: state.enabled,
  requests: state.requests,
  errorMessage: state.errorMessage,
  checkedReqs : state.checkedReqs,
  ResponseText : state.ResponseText,
  interceptStatus: state.interceptStatus
});

const mapDispatchToProps: DispatchProps = {
  startListening,
  stopListening,
  errorNotify,
  updateField,
  updateFields,
  clearFields,
  handleCheckToggle,
  handleCheckedRequests,
  handleStatusCodeChange,
  handleRespTextChange
};

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
