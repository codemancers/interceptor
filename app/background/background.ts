import { wrapStore } from "react-chrome-redux";

import { RequestObj } from "./../components/request_list";
import { INITIAL_POPUP_STATE } from "./../reducers/rootReducer";
import store from "./../store/popup_store";
export const createStore = store({ ...INITIAL_POPUP_STATE });

interface TabRecord {
  tabId: number;
  enabled: boolean;
  requests: Array<RequestObj>;
}

interface Recordings {
  [index: number]: TabRecord;
}

wrapStore(createStore, {
  portName: "INTERCEPTOR"
});

class BackgroundWorker {
  currentTab: number = -1;
  data: Recordings;
  constructor() {
    this.data = {};
  }

  startMessageListener = () => {
    //Send a message to content-script on when a page reloads
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete") {
        chrome.tabs.sendMessage(Number(tab.id), { message: "PAGE_REFRESHED", tabId });
      }
    });
    chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
      if (!request.tabId) {
        return;
      }
      this.currentTab = request.tabId;
      if (!this.data[this.currentTab]) {
        this.data[this.currentTab] = {
          enabled: false,
          requests: [],
          tabId: -1
        };
      }
      switch (request.message) {
        case "CLEAR_DATA": {
          this.clearData();
          break;
        }
        case "ENABLE_LOGGING": {
          this.startTrackingRequests();
          break;
        }
        case "GET_ENABLED_STATUS": {
          const data = this.data[this.currentTab];
          sendResponse(data.enabled);
          break;
        }
        case "DISABLE_LOGGING": {
          this.stopTrackingRequests();
          break;
        }
        case "GET_COUNT": {
          sendResponse(this.data[this.currentTab].requests.length);
          break;
        }
        case "UPDATE_BADGE_ICON": {
          this.updateBadgeIcon(request.tabId, request.disabledStatus);
          break;
        }
      }
    });
  };

  updateBadgeIcon = (tabId: number, disabledStatus: boolean) => {
    const iconBadgeIconPath = disabledStatus ? "images/icon-disabled-16.png" : "images/icon-16.png";
    chrome.browserAction.setIcon({
      path: {
        "16": iconBadgeIconPath
      },
      tabId
    });
  };

  updateBadgeText = () => {
    chrome.browserAction.setBadgeText({
      text: `${createStore.getState().requests.length}`,
      tabId: this.currentTab
    });
  };

  callback = (details: any) => {
    const tabRecords = this.data[this.currentTab];
    if (this.data[this.currentTab].enabled && this.currentTab === details.tabId) {
      this.updateBadgeText();
      if (
        tabRecords.requests.filter(
          req =>
            req.requestId === details.requestId ||
            (req.url === details.url && req.method === details.method)
        ).length > 0
      ) {
        return;
      }
      tabRecords.requests.push(details);
      createStore.dispatch({
        type: "UPDATE_REQUEST",
        payload: details
      });
      this.updateBadgeText();
      this.data[this.currentTab] = tabRecords;
    }
  };

  startTrackingRequests = () => {
    this.data[this.currentTab].enabled = true;
    chrome.webRequest.onBeforeSendHeaders.addListener(
      //For getting responseHeaders : use onHeadersReceived Event
      this.callback,
      {
        urls: ["<all_urls>"],
        types: ["xmlhttprequest"]
      },
      ["requestHeaders"]
    );
  };

  stopTrackingRequests = () => {
    this.data[this.currentTab].enabled = false;
  };
  clearData = () => {
    this.updateBadgeText();
  };
}

new BackgroundWorker().startMessageListener();
