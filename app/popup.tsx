import * as React from "react";
import * as ReactDOM from "react-dom";
import * as cx from "classnames";
import * as MessageService from "./message_service";
import RequestList from "./request_list";
import {PopUpInterface} from './popup_store'
import { connect, Provider } from 'react-redux';
import initializeStore from './popup_store'

const CHROME_URL_REGEX = /^chrome:\/\/.+$/;

const isChromeUrl = (url: string) => {
  return CHROME_URL_REGEX.test(url);
};

type DEFAULT_PROPS = {
  enabled: false;
  tabId: -1;
  tabUrl: "";
  handleRequests : () => {}
}
type STATE = {}

class Popup extends React.Component<DEFAULT_PROPS, STATE>{
  componentWillMount() {
    MessageService.getRequests(this.props.tabId, requests => {
      this.setState({ requests });
    });
  }

  isUrlInValid = (tabUrl: string) => {
    return !tabUrl || isChromeUrl(tabUrl);
  };

  handleClick = () => { this.props.handleRequests(enabled) }
  //   const isEnabled = this.state.enabled;
  //   const willBeEnabled = !isEnabled;
  //   const label = willBeEnabled ? "Stop Listening" : "Start Listening";
  //   const { tabId, tabUrl } = this.props;
  //   MessageService.getRequests(this.props.tabId, requests => {
  //     if (isEnabled) {
  //       MessageService.disableLogging(tabUrl, tabId);
  //     } else {
  //       MessageService.enableLogging(tabUrl, tabId);
  //     }
  //     this.setState({ enabled: willBeEnabled, label, errorMessage: "", requests });
  //   });

  //   if (this.isUrlInValid(tabUrl)) {
  //     this.setState({ errorMessage: `Cannot start listening on ${tabUrl}` });
  //     return;
  //   }
  // };

  render() {
    const errorMessage = this.props.errorMessage;
    const isListening = this.props.enabled;
    const buttonClass = cx("button", { "button-start-listening": !isListening, "button-stop-listening": isListening });

    return (
      <div className="popup">
        {errorMessage ? ( <p className="popup-error-message popup-error"> {errorMessage} </p> ) : null}
        <button type="button" onClick={this.props.handleClick} className={buttonClass}>
          {this.props.enabled ? "Stop Listening" : "Start Listening"}
        </button>
        <RequestList requests={this.state.requests} />
      </div>
    );
  }
}

const queryParams: chrome.tabs.QueryInfo = {
  active: true,
  currentWindow: true
};

chrome.tabs.query(queryParams, tabs => {
  const tab = tabs[0];
  if (!tab) return;

  const { id, url } = tab;
  if (typeof id === "undefined" || typeof url === "undefined") return;

  MessageService.getEnabledStatus(id, (enabled: boolean) => {
    ReactDOM.render(
      <Provider store={initializeStore}>
        <Popup enabled={enabled} tabId={id} tabUrl={url} handleRequests={ } />
      </Provider>
      ,
      document.getElementById("root")
    );
  });
});
