/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />

import * as React from "react"
import * as ReactDOM from "react-dom"
import * as MessageService from './message_service'

const enableFunc = () => {
  chrome.tabs.getSelected(tab => {
   if (tab.url && tab.id) {
      MessageService.enableLogging(tab.url, tab.id);
    }
  });
}

const disableFunc = () => {
  chrome.tabs.getSelected(tab => {
    if (tab.url && tab.id) {
      MessageService.disableLogging(tab.url, tab.id);
    }
  });
}

interface PopupProps { enabled: boolean }

const Popup = (props: PopupProps) => {
  const onClickFunc = props.enabled ? disableFunc : enableFunc;
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
  const id = tabs[0].id;

  if (id) {
    MessageService.getEnabledStatusForTab(id, (enabled: boolean) => {
      ReactDOM.render(<Popup enabled={enabled} />, document.getElementById('root'));
    });
  }

  ReactDOM.render(<Popup enabled={false} />, document.getElementById('root'));
});
