import * as React from "react";
import * as cx from "classnames";
import {connect} from "react-redux";
import {Store} from "react-chrome-redux";

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
  handlePaginationChange: typeof actionTypes.handlePaginationChange;
  updateInterceptorStatus: typeof actionTypes.updateInterceptorStatus;
  fetchResponse:typeof actionTypes.fetchResponse;
}

const CHROME_URL_REGEX = /^chrome:\/\/.+$/;

const isChromeUrl = (url: string) => {
  return CHROME_URL_REGEX.test(url);
};

interface BgStore {
  ready(): Promise<void>;
  getState(): any;
  dispatch: any;
}

export class Popup extends React.Component<POPUP_PROPS & DispatchProps, {}> {
  componentWillMount() {
    this.props.updateField("interceptStatus", "");
    this.props.updateField("tabId", this.props.tabId);
    this.props.updateField("tabUrl", this.props.tabUrl);
    MessageService.getRequests(this.props.tabId, requests => {
      this.props.updateField("requests", requests);
    });

    MessageService.getEnabledStatus(this.props.tabId, (enabledStatus: boolean) => {
      this.props.updateField("enabled", enabledStatus);
    });
    this.props.updateField("errorMessage", "");
    if(this.props.isInterceptorOn[this.props.tabId] === undefined ){
      this.props.updateInterceptorStatus(this.props.tabId, true)
     }
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
    MessageService.interceptChecked(this.props.tabId, requests);
  };

  handlePaginationChange = (newPageNo_rowSize: string, tabId: number, field: string) => {
    this.props.handlePaginationChange(newPageNo_rowSize, tabId, field);
  };

  disableInterceptor =(tabId:number) => {
    MessageService.disableInterceptor(tabId)
  }

  updateInterceptorStatus = (tabId:number, interceptMode:boolean) => {
    this.props.updateInterceptorStatus(tabId, interceptMode)
  }
 updateBadgeIcon = (tabId:number,disabledStatus:boolean) => {
    MessageService.updateBadgeIcon(tabId,disabledStatus)
  }

  handleSwitch = () => {
    if(this.props.isInterceptorOn[this.props.tabId]){
      this.props.updateInterceptorStatus(this.props.tabId, false)
      .then(() => {
        this.disableInterceptor(this.props.tabId)
        this.updateBadgeIcon(this.props.tabId, true)
      })
      .catch((err) => {
        // something broke in the background store
        console.log(err)
      });
    }else{
      this.props.updateInterceptorStatus(this.props.tabId, true)
      this.updateBadgeIcon(this.props.tabId, false)
    }
  }

  render() {
    const buttonClass = cx("btn btn-block", {
      "button-start-listening btn-secondary": !this.props.enabled,
      "button-stop-listening btn-danger": this.props.enabled
    });
    return (
      <div className="popup">
        <header>
          <div className="grid-container">
            <a className="logo" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Interceptor"
                role="Image"
                viewBox="0 0 32 32"
                width="16"
                height="16"
              >
                <rect fill="#3A539B" width="32" height="32" x="0" y="0" />
                <path
                  fill="#ffffff"
                  d="M 1,1 1,31 13.875,18.125 4.84375,9.09375 l 4.25,-4.25 L 18.125,13.875 31,1 1,1 z"
                />
                <path
                  fill="#ffffff"
                  d="m 18.125,13.875 -4.25,4.25 9.03125,9.03125 4.25,-4.25 L 18.125,13.875 z"
                />
                <path fill="#ffffff" d="m 31,1 1,-1 0,32 -32,0 1,-1 30,0" />
                <path fill="#ffffff" d="m 31,1 1,-1 0,32 -32,0 1,-1 30,0" />
              </svg>
              <span>INTERCEPTOR</span>
            </a>
            <button type="button" onClick={this.handleClick} className={buttonClass}>
              {this.props.enabled ? "Stop Listening" : "Start Listening"}
            </button>
          </div>
        </header>

        <div>
          {this.props.errorMessage ? (
            <p className="popup-error-message popup-error"> {this.props.errorMessage} </p>
          ) : null}
          {
            this.props.interceptStatus &&
            <div id="success-msg">
              {this.props.interceptStatus}
            </div>
          }

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
            handlePaginationChange={this.props.handlePaginationChange}
            PageDetails={this.props.PageDetails}
            tabId={this.props.tabId}
            clearRequests={this.clearRequests}
            disableInterceptor={this.disableInterceptor}
            updateInterceptorStatus={this.updateInterceptorStatus}
            isInterceptorOn={this.props.isInterceptorOn}
            handleSwitch={this.handleSwitch}
            fetchResponse={this.props.fetchResponse}
            responseData={this.props.responseData}
          />
        </div>
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
  PageDetails: state.PageDetails,
  interceptStatus: state.interceptStatus,
  isInterceptorOn: state.isInterceptorOn,
  responseData: state.responseData
});

const mapDispatchToProps: DispatchProps = {
  startListening: actionTypes.startListening,
  stopListening: actionTypes.stopListening,
  errorNotify: actionTypes.errorNotify,
  updateField: actionTypes.updateField,
  updateFields: actionTypes.updateFields,
  clearFields: actionTypes.clearFields,
  handleCheckToggle: actionTypes.handleCheckToggle,
  handleCheckedRequests: actionTypes.handleCheckedRequests,
  handleStatusCodeChange: actionTypes.handleStatusCodeChange,
  handleRespTextChange: actionTypes.handleRespTextChange,
  handleContentTypeChange: actionTypes.handleContentTypeChange,
  handlePaginationChange: actionTypes.handlePaginationChange,
  updateInterceptorStatus: actionTypes.updateInterceptorStatus,
  fetchResponse:actionTypes.fetchResponse
};

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
