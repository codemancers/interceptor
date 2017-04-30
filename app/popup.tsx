/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />

import * as React from "react"
import * as ReactDOM from "react-dom"
import * as MessageService from './message_service'

const enableFunc = () => {
  chrome.tabs.getSelected(tab => {
    MessageService.enableLogging(tab.url, tab.id);
  });
  window.close();
}

const disableFunc = () => {
  chrome.tabs.getSelected(tab => {
    MessageService.disableLogging(tab.url, tab.id);
  });
  window.close();
}

interface PopupProps { enabled: boolean }

const Popup = (props: PopupProps) => {
  const onClickFunc = props.enabled ? enableFunc : disableFunc;
  const buttonDesc = props.enabled ? 'Disable': 'Enable';

  return (
    <button type='button' onClick={onClickFunc}>
      {buttonDesc}
    </button>
  );
}

const queryParams : chrome.tabs.QueryInfo = {
  active: true,
  currentWindow: true
}

chrome.tabs.query(queryParams, tabs => {
  MessageService.getEnabledStatusForTab(tabs[0].id, (enabled: boolean) => {
    ReactDOM.render(<Popup enabled={enabled} />, document.getElementById('root'));
  });
});
