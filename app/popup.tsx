import * as React from "react";
import * as cx from "classnames";
import { connect } from 'react-redux';

import * as MessageService from "./message_service";
import RequestList from "./request_list";
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

  interceptRequests= (url:string, method:string, statusCode:number) =>  {
    MessageService.interceptRequests(this.props.tabId, url,method,statusCode)
  }

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
    const buttonClass = cx("button", { "button-start-listening": !this.props.enabled, "button-stop-listening": this.props.enabled });
    return (
      <div className="popup">
        {this.props.errorMessage ? ( <p className="popup-error-message popup-error"> {this.props.errorMessage} </p> ) : null}
        <button type="button" onClick={this.handleClick} className={buttonClass}>
          {this.props.enabled ? "Stop Listening" : "Start Listening"}
        </button>
        <button type="button" onClick={this.clearRequests} className="btn-clear">CLEAR</button>
        <RequestList requests={this.props.requests} handleIntercept={this.interceptRequests} />
      </div>
    );
  }
}

const mapStateToProps = (state:POPUP_PROPS) => ({ enabled: state.enabled, requests: state.requests, errorMessage : state.errorMessage })

const mapDispatchToProps:DispatchProps = {
  startListening, 
  stopListening, 
  errorNotify, 
  updateField,
  updateFields,
  clearFields
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Popup);

