import * as React from "react";
import {render} from 'react-dom'
import * as cx from "classnames";
import * as MessageService from "./message_service";
import RequestList from "./request_list";
import { Provider, connect } from 'react-redux';
import store from './popup_store'
import {POPUP_PROPS} from './types'
import {startListening, stopListening, errorNotify, updateField, clearFields, updateFields } from './actions'

interface DispatchProps{
  startListening: typeof startListening,
  stopListening : typeof stopListening,
  errorNotify : typeof errorNotify,
  updateField : typeof updateField,
  clearFields : typeof clearFields,
  updateFields : typeof updateFields
}

const CHROME_URL_REGEX = /^chrome:\/\/.+$/;

const isChromeUrl = (url: string) => {
  return CHROME_URL_REGEX.test(url);
};

export class Popup extends React.Component<POPUP_PROPS & DispatchProps, {}  >{

  componentWillMount() {
    MessageService.getRequests(this.props.tabId, requests => {
      this.props.updateField('requests', requests);
    });
  }

  isUrlInValid = (tabUrl: string) => {
    return !tabUrl || isChromeUrl(tabUrl);
  };

  handleClick = (_: React.MouseEvent<{}>) : void => { 
    if(this.props.enabled) {
      MessageService.disableLogging(this.props.tabUrl, this.props.tabId);
      this.props.updateField('enabled', false);
    } else {
      MessageService.getRequests(this.props.tabId, requests => {
        MessageService.enableLogging(this.props.tabUrl, this.props.tabId);
        this.props.updateFields({ enabled: true, requests })  
      });
    }
    
    if (this.isUrlInValid(this.props.tabUrl)) {
      this.props.errorNotify(`Cannot Start Listening on ${this.props.tabUrl}`);
      return;
    }
  };

  clearRequests = (_: React.MouseEvent<{}>) : void => {
    MessageService.clearData(this.props.tabId)
    this.props.clearFields();
  }

  render() {
    const buttonClass = cx("btn btn-block", { "btn-secondary": !this.props.enabled, "btn-danger": this.props.enabled });
    return (
      <div>
        <header>
          <div className="grid-container">
            <a className="logo" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Interceptor" role="Image"
                viewBox="0 0 32 32" width="16" height="16">
                <rect fill="#009688" width="32" height="32" x="0" y="0" />
                <path fill="#ffffff" d="M 1,1 1,31 13.875,18.125 4.84375,9.09375 l 4.25,-4.25 L 18.125,13.875 31,1 1,1 z" />
                <path fill="#ffffff" d="m 18.125,13.875 -4.25,4.25 9.03125,9.03125 4.25,-4.25 L 18.125,13.875 z" />
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
        <section>
          <div className="container">
            {this.props.errorMessage ? ( <p className="popup-error-message popup-error"> {this.props.errorMessage} </p> ) : null}
            <table>
              <tr>
                <th />
                <th>Request URLs</th>
                <th className="text-right"><button type="button" className="btn btn-sm btn-primary btn-clear" onClick={this.clearRequests}>CLEAR</button></th>
              </tr>
            </table>
            <div className="scroll-container">
              <table>
                <RequestList requests={this.props.requests} />
              </table>
            </div>
          </div>
        </section>
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
  updateFields,
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
        <ConnectedPopup enabled={enabled} tabUrl={url} tabId={id} />
      </Provider>,
      document.getElementById("root") as HTMLElement
    );
  });
});