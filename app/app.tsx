import * as React from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux';

import store from './popup_store'
import * as MessageService from './message_service'

// components
import Popup from './popup'

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
    const requests:Array<any> = []
    render(
      <Provider store={store({enabled, requests})}>
         <Popup tabUrl={url} tabId={id} />
      </Provider>,
      document.getElementById("root") as HTMLElement
    );
  });
});