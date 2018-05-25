import * as React from "react";
import * as cx from "classnames";
import { connect } from "react-redux";

import * as MessageService from "./../message_service";
import RequestList from "./../components/RequestList";
import { POPUP_PROPS } from "./../types";
import * as actionTypes from "./../actions";

interface DispatchProps {
  errorNotify: typeof actionTypes.errorNotify;
  clearFields: typeof actionTypes.clearFields;
  handleCheckToggle: typeof actionTypes.handleCheckToggle;
  handleRespTextChange: typeof actionTypes.handleRespTextChange;
  handleStatusCodeChange: typeof actionTypes.handleStatusCodeChange;
  handleContentTypeChange: typeof actionTypes.handleContentTypeChange;
  handlePaginationChange: typeof actionTypes.handlePaginationChange;
  updateInterceptorStatus: typeof actionTypes.updateInterceptorStatus;
  fetchResponse: typeof actionTypes.fetchResponse;
  toggleListeningRequests: typeof actionTypes.toggleListeningRequests;
}

const CHROME_URL_REGEX = /^chrome:\/\/.+$/;

const isChromeUrl = (url: string) => {
  return CHROME_URL_REGEX.test(url);
};
export class Popup extends React.Component<POPUP_PROPS & DispatchProps, {}> {
  isUrlInValid = (tabUrl: string) => {
    return !tabUrl || isChromeUrl(tabUrl);
  };

  handleClick = (_: React.MouseEvent<HTMLButtonElement>): void => {
    const { props } = this;
    if (this.isUrlInValid(props.currentUrl)) {
      props.errorNotify(`Cannot Start Listening on ${props.currentUrl}`, props.currentTab);
      return;
    }
    if (props.data.enabledStatus) {
      MessageService.disableLogging(props.currentTab);
    } else {
      MessageService.enableLogging(props.currentTab);
    }
  };

  clearRequests = (_: React.MouseEvent<HTMLButtonElement>): void => {
    this.props
      .clearFields(this.props.currentTab)
      .then(() => {
        MessageService.updateBadgeCount(this.props.currentTab);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  handleCheckedRequests = (requests: Array<chrome.webRequest.WebRequestDetails>): void => {
    MessageService.interceptChecked(this.props.currentTab, requests);
  };

  disableInterceptor = (tabId: number): void => {
    MessageService.disableInterceptor(tabId);
  };

  updateBadgeIcon = (tabId: number, disabledStatus: boolean) => {
    MessageService.updateBadgeIcon(tabId, disabledStatus);
  };

  handleSwitch = () => {
    const { props } = this;
    if (props.data.isInterceptorOn) {
      props
        .updateInterceptorStatus(props.currentTab, false)
        .then(() => {
          this.disableInterceptor(props.currentTab);
          this.updateBadgeIcon(props.currentTab, true);
        })
        .catch((err: any) => {
          // something broke in the background store
          console.log(err);
        });
    } else {
      props.updateInterceptorStatus(props.currentTab, true);
      this.updateBadgeIcon(props.currentTab, false);
    }
  };

  render() {
    const { props } = this;
    if (!props.data) {
      return null;
    }
    const buttonClass = cx("btn btn-block", {
      "button-start-listening btn-secondary": !props.data.enabledStatus,
      "button-stop-listening btn-danger": props.data.enabledStatus
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
            <button
              title={
                props.data.enabledStatus
                  ? "Stop Listening to Requests"
                  : "Start Listening to Requests"
              }
              type="button"
              onClick={this.handleClick}
              className={buttonClass}
            >
              {props.data.enabledStatus ? "Stop Listening" : "Start Listening"}
            </button>
          </div>
        </header>

        <div>
          {props.data.errorMessage ? (
            <p className="popup-error-message popup-error"> {props.data.errorMessage} </p>
          ) : null}
          {props.data.interceptStatus && <div id="success-msg">{props.data.interceptStatus}</div>}

          <RequestList
            data={props.data}
            handleCheckToggle={props.handleCheckToggle}
            handleCheckedRequests={this.handleCheckedRequests}
            handleRespTextChange={props.handleRespTextChange}
            handleStatusCodeChange={props.handleStatusCodeChange}
            handleContentTypeChange={props.handleContentTypeChange}
            handlePaginationChange={props.handlePaginationChange}
            currentTabId={props.currentTab}
            clearRequests={this.clearRequests}
            updateInterceptorStatus={props.updateInterceptorStatus}
            handleSwitch={this.handleSwitch}
            fetchResponse={props.fetchResponse}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: POPUP_PROPS) => {
  return {
    data: state.data[state.currentTab],
    currentTab: state.currentTab,
    currentUrl: state.currentUrl
  };
};

const mapDispatchToProps: DispatchProps = {
  errorNotify: actionTypes.errorNotify,
  clearFields: actionTypes.clearFields,
  handleCheckToggle: actionTypes.handleCheckToggle,
  handleStatusCodeChange: actionTypes.handleStatusCodeChange,
  handleRespTextChange: actionTypes.handleRespTextChange,
  handleContentTypeChange: actionTypes.handleContentTypeChange,
  handlePaginationChange: actionTypes.handlePaginationChange,
  updateInterceptorStatus: actionTypes.updateInterceptorStatus,
  fetchResponse: actionTypes.fetchResponse,
  toggleListeningRequests: actionTypes.toggleListeningRequests
};

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
