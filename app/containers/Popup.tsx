import * as React from "react";
import * as uuid from "uuid";
import * as cx from "classnames";
import { connect } from "react-redux";

import * as MessageService from "./../message_service";
import { Logo } from "./../components/Logo";
import { AddRuleModal } from "./../components/AddRuleModal";
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
  sendMessageToUI: typeof actionTypes.sendMessageToUI;
  updateRequest: typeof actionTypes.updateRequest;
  updateAddRequestMethod: typeof actionTypes.updateAddRequestMethod;
  updateAddRequestUrl: typeof actionTypes.updateAddRequestUrl;
  toggleAddRequestForm: typeof actionTypes.toggleAddRequestForm;
  handleChangeUrl: typeof actionTypes.handleChangeUrl;
  fetchFailure: typeof actionTypes.fetchFailure;
  addRuleErrorNotify: typeof actionTypes.addRuleErrorNotify;
}

const CHROME_URL_REGEX = /^chrome:\/\/.+$/;

const isChromeUrl = (url: string) => {
  return CHROME_URL_REGEX.test(url);
};
export class Popup extends React.Component<POPUP_PROPS & DispatchProps, {}> {
  isUrlInValid = (tabUrl: string) => {
    return !tabUrl || isChromeUrl(tabUrl);
  };

  toggleListening = (): void => {
    const { props } = this;
    if (this.isUrlInValid(props.currentUrl)) {
      props.errorNotify(`Cannot Start Listening on ${props.currentUrl}`, props.currentTab);
      return;
    }
    if (props.tabRecord.enabledStatus) {
      MessageService.disableLogging(props.currentTab);
    } else {
      MessageService.enableLogging(props.currentTab);
    }
  };

  clearRequests = (): void => {
    MessageService.clearData(this.props.currentTab);
    this.props.clearFields(this.props.currentTab);
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

  handleSwitchToggle = () => {
    const { props } = this;
    if (props.tabRecord.isInterceptorOn) {
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
      props.sendMessageToUI("Interception Enabled!", props.currentTab);
      this.updateBadgeIcon(props.currentTab, false);
    }
  };

  addRequest = (url: string, method: string) => {
    const requestObject = {
      method,
      requestId: uuid().replace(/-/g, ""),
      tabId: this.props.currentTab,
      type: "xmlhttprequest",
      url
    };
    this.props.updateRequest(this.props.currentTab, requestObject);
  };

  toggleAddRequestForm = () => {
    this.props.toggleAddRequestForm(!this.props.tabRecord.showAddRequest, this.props.currentTab);
  };

  render() {
    const { props } = this;
    const { tabRecord } = props;
    if (!tabRecord) {
      return "Loading...";
    }
    const buttonClass = cx("btn btn-block", {
      "button-start-listening btn-secondary": !tabRecord.enabledStatus,
      "button-stop-listening btn-danger": tabRecord.enabledStatus
    });
    const buttonLabel = tabRecord.enabledStatus ? "Stop Listening" : "Start Listening";

    return (
      <div className="popup">
        <header>
          <div className="grid-container">
            <Logo />
            <button
              title={buttonLabel + " to Requests"}
              onClick={this.toggleListening}
              className={buttonClass}
            >
              {buttonLabel}
            </button>
          </div>
        </header>

        <div>
          {tabRecord.errorMessage && (
            <p className="popup-error-message popup-error"> {tabRecord.errorMessage} </p>
          )}
          {props.interceptStatus && <div id="success-msg">{props.interceptStatus}</div>}
          {tabRecord.showAddRequest && (
            <AddRuleModal
              handleClose={this.toggleAddRequestForm}
              updateAddRequestUrl={props.updateAddRequestUrl}
              updateAddRequestMethod={props.updateAddRequestMethod}
              addRequest={this.addRequest}
              addRequestUrl={tabRecord.addRequestUrl}
              addRequestMethod={tabRecord.addRequestMethod}
              tabId={props.currentTab}
              addRuleErrorNotify={props.addRuleErrorNotify}
              addRuleError={props.tabRecord.addRuleError}
            />
          )}
          <button
            type="button"
            className="btn btn-sm"
            onClick={this.toggleAddRequestForm}
          >
            Add Rule
          </button>

          <RequestList
            tabRecord={tabRecord}
            handleCheckToggle={props.handleCheckToggle}
            handleCheckedRequests={this.handleCheckedRequests}
            handleRespTextChange={props.handleRespTextChange}
            handleStatusCodeChange={props.handleStatusCodeChange}
            handleContentTypeChange={props.handleContentTypeChange}
            handlePaginationChange={props.handlePaginationChange}
            currentTabId={props.currentTab}
            clearRequests={this.clearRequests}
            updateInterceptorStatus={props.updateInterceptorStatus}
            handleSwitchToggle={this.handleSwitchToggle}
            fetchResponse={props.fetchResponse}
            handleChangeUrl={props.handleChangeUrl}
            fetchFailure={props.fetchFailure}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: POPUP_PROPS) => {
  return {
    tabRecord: state.tabRecord[state.currentTab],
    currentTab: state.currentTab,
    currentUrl: state.currentUrl,
    interceptStatus: state.interceptStatus
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
  toggleListeningRequests: actionTypes.toggleListeningRequests,
  sendMessageToUI: actionTypes.sendMessageToUI,
  updateRequest: actionTypes.updateRequest,
  updateAddRequestMethod: actionTypes.updateAddRequestMethod,
  updateAddRequestUrl: actionTypes.updateAddRequestUrl,
  toggleAddRequestForm: actionTypes.toggleAddRequestForm,
  handleChangeUrl: actionTypes.handleChangeUrl,
  fetchFailure: actionTypes.fetchFailure,
  addRuleErrorNotify: actionTypes.addRuleErrorNotify
};

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
