import * as React from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux';

import store from './popup_store'
import * as MessageService from './message_service'
import {INITIAL_POPUP_STATE} from './modules/recordings'

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
    const createStore = store({...INITIAL_POPUP_STATE, enabled});
    render(
      <Provider store={createStore} >
         <Popup tabUrl={url} tabId={id} enabled={enabled}/>
      </Provider>,
      document.getElementById("root") as HTMLElement
    );
  });
});