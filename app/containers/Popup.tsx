import * as React from "react";
import * as uuid from "uuid";
import * as cx from "classnames";
import { connect } from "react-redux";

import * as MessageService from "../message_service";
import { Logo } from "../components/Logo";
import RequestList from "../components/RequestList";
import { POPUP_PROPS } from "../types";
import * as actionTypes from "../actions";
import { updateAddRequestFields } from "../actions/addRequest";
//icons
import { PlayIcon } from "../components/Icons/PlayIcon";
import { StopIcon } from "../components/Icons/StopIcon";

import { InterceptAllButton } from "./../components/InterceptAllButton";
import { Switch } from "./../components/Switch";
import AddRuleModal from "./../components/AddRuleModal";

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
  toggleAddRequestForm: typeof actionTypes.toggleAddRequestForm;
  handleChangeUrl: typeof actionTypes.handleChangeUrl;
  fetchFailure: typeof actionTypes.fetchFailure;
}

const CHROME_URL_REGEX = /^chrome:\/\/.+$/;

const isChromeUrl = (url: string) => {
  return CHROME_URL_REGEX.test(url);
};
export class Popup extends React.Component<POPUP_PROPS & DispatchProps, {}> {
  componentDidMount() {
    //close the add modal form when switching to other tab
    //if not called, then the modal will be open when popup is open in other tab
    this.props.toggleAddRequestForm(false);
  }
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
          props.sendMessageToUI("Interception Disabled", props.currentTab);
        })
        .catch((err: any) => {
          // something broke in the background store
          console.log(err);
        });
    } else {
      props.updateInterceptorStatus(props.currentTab, true);
      props.sendMessageToUI("Interception Enabled", props.currentTab);
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
    this.props.toggleAddRequestForm(!this.props.showAddRuleModal);
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
    const buttonLabel = tabRecord.enabledStatus ? " Stop Listening" : " Start Listening";
    const ButtonIcon = tabRecord.enabledStatus ? PlayIcon : StopIcon;
    const enabledRequests = tabRecord.requests
      ? tabRecord.requests.filter((request: chrome.webRequest.WebRequestFullDetails) => {
          return tabRecord.checkedReqs[request.requestId];
        })
      : [];

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
              <ButtonIcon width="1em" height="1em" />
              {buttonLabel}
            </button>
          </div>
        </header>

        <div>
          {tabRecord.errorMessage && (
            <p className="popup-error-message popup-error"> {tabRecord.errorMessage} </p>
          )}
          {props.interceptStatus && <div id="success-msg">{props.interceptStatus}</div>}

          <div className="grid-container response-action">
            <Switch
              isOn={props.tabRecord.isInterceptorOn}
              handleSwitchToggle={this.handleSwitchToggle}
            />
            <div className="text-right">
              <button type="button" className="btn btn-sm" onClick={this.toggleAddRequestForm}>
                Add Rule
              </button>
              <InterceptAllButton
                disabled={!enabledRequests.length}
                handleCheckedRequests={() => {
                  return this.handleCheckedRequests(enabledRequests);
                }}
              />
              <button
                type="button"
                title="Clear All Requests"
                className="btn btn-sm btn-primary btn-clear"
                onClick={this.clearRequests}
              >
                CLEAR
              </button>
            </div>
          </div>

          {props.showAddRuleModal && (
            <AddRuleModal
              handleClose={this.toggleAddRequestForm}
              addRequestDetails={props.addRequestDetails}
              updateRequest={props.updateRequest}
              tabId={props.currentTab}
              updateAddRequestFields={props.updateAddRequestFields}
            />
          )}

          <RequestList
            tabRecord={tabRecord}
            handleCheckToggle={props.handleCheckToggle}
            handleRespTextChange={props.handleRespTextChange}
            handleStatusCodeChange={props.handleStatusCodeChange}
            handleContentTypeChange={props.handleContentTypeChange}
            handlePaginationChange={props.handlePaginationChange}
            currentTabId={props.currentTab}
            updateInterceptorStatus={props.updateInterceptorStatus}
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
    tabRecord: state.rootReducer.tabRecord[state.rootReducer.currentTab],
    currentTab: state.rootReducer.currentTab,
    currentUrl: state.rootReducer.currentUrl,
    interceptStatus: state.rootReducer.interceptStatus,
    showAddRuleModal: state.rootReducer.showAddRuleModal,
    addRequestDetails: state.addRequestReducer
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
  toggleAddRequestForm: actionTypes.toggleAddRequestForm,
  handleChangeUrl: actionTypes.handleChangeUrl,
  fetchFailure: actionTypes.fetchFailure,
  updateAddRequestFields
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Popup);
