import * as React from "react";
import {render} from 'react-dom'
import * as cx from "classnames";
import * as MessageService from "./message_service";
import RequestList from "./request_list";
import { Provider, connect } from 'react-redux';
import store from './popup_store'
import {POPUP_PROPS} from './types'
import {startListening, stopListening, errorNotify, updateField, clearFields } from './actions'

interface DispatchProps{
  startListening: typeof startListening,
  stopListening : typeof stopListening,
  errorNotify : typeof errorNotify,
  updateField : typeof updateField
  clearFields : typeof clearFields
}

const CHROME_URL_REGEX = /^chrome:\/\/.+$/;

const isChromeUrl = (url: string) => {
  return CHROME_URL_REGEX.test(url);
};

export class Popup extends React.Component<POPUP_PROPS & DispatchProps, {}  >{

  componentWillMount() {
    MessageService.getRequests(this.props.tabId, requests => {
      this.props.updateField({ requests });
    });
  }

  isUrlInValid = (tabUrl: string) => {
    return !tabUrl || isChromeUrl(tabUrl);
  };

  handleClick = (_: React.MouseEvent<{}>) : void => { 
    const isEnabled = this.props.enabled;
    const { tabId, tabUrl } = this.props;
    MessageService.getRequests(tabId, requests => {
      if (isEnabled) {
        MessageService.disableLogging(tabUrl, tabId);
        this.props.stopListening(isEnabled);
      } else {
        MessageService.enableLogging(tabUrl, tabId);
        this.props.startListening(isEnabled);
        this.props.updateField(requests);
      }
      // this.setState({ enabled: willBeEnabled, errorMessage: "", requests });      
    });

    if (this.isUrlInValid(tabUrl)) {
      this.props.errorNotify(tabUrl);
      return;
    }
  };

  clearRequests = (_: React.MouseEvent<{}>) : void => {
    this.props.clearFields();
  }

  render() {
    const props = this.props
    const { requests ,enabled, errorMessage } = props;

    const isListening = enabled;
    const buttonClass = cx("button", { "button-start-listening": !isListening, "button-stop-listening": isListening });

    return (
      <div className="popup">
        {errorMessage ? ( <p className="popup-error-message popup-error"> {errorMessage} </p> ) : null}
        <button type="button" onClick={this.handleClick} className={buttonClass}>
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>
        <button type="button" onClick={this.clearRequests} className="btn-clear">CLEAR</button>
        <RequestList requests={requests.requests} />
      </div>
    );
  }
}

const queryParams: chrome.tabs.QueryInfo = {
  active: true,
  currentWindow: true
};

const mapStateToProps = (state:POPUP_PROPS) => ({ enabled: state.enabled, requests: state.requests, errorMessage : state.errorMessage })

const mapDispatchToProps:DispatchProps = {
  startListening, 
  stopListening, 
  errorNotify, 
  updateField,
  clearFields
};

const ConnectedPopup:React.ComponentClass<POPUP_PROPS & DispatchProps> = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Popup);

chrome.tabs.query(queryParams, tabs => {
  const tab = tabs[0];
  if (!tab) return;

  const { id, url } = tab;
  if (typeof id === "undefined" || typeof url === "undefined") return;

  MessageService.getEnabledStatus(id, (enabled: boolean) => {
    const requests:Array<any> = []
    render(
      <Provider store={store({enabled, requests})}>
         <ConnectedPopup tabUrl={url} tabId={id} />
      </Provider>,
      document.getElementById("root") as HTMLElement
    );
  });
});