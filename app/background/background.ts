import { wrapStore } from "webext-redux";

import { INITIAL_POPUP_STATE } from "./../reducers/rootReducer";
import { initialState } from "./../reducers/addRequest";
import createStore from "./../store/popup_store";
export const store = createStore({
  rootReducer: INITIAL_POPUP_STATE,
  addRequestReducer: initialState
});
import { toggleListeningRequests, updateRequest } from "./../actions";

interface TabRecord {
  tabId: number;
  enabled: boolean;
  requests: Array<chrome.webRequest.WebRequestDetails>;
}

interface Recordings {
  [index: number]: TabRecord;
}

wrapStore(store, {
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
    chrome.runtime.onMessage.addListener(request => {
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
        case "ENABLE_LOGGING": {
          this.startTrackingRequests(request.tabId);
          break;
        }
        case "DISABLE_LOGGING": {
          this.stopTrackingRequests(request.tabId);
          break;
        }
        case "CLEAR_DATA": {
          this.clearData(request.tabId);
          break;
        }
        case "UPDATE_BADGE_ICON": {
          this.updateBadgeIcon(request.tabId, request.disabledStatus);
          break;
        }
        case "UPDATE_BADGE_TEXT": {
          this.updateBadgeText(request.tabId, request.count);
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

  updateBadgeText = (tabId: number, requestsLength: number) => {
    const text = `${requestsLength}`;
    chrome.browserAction.setBadgeText({ text, tabId });
  };

  callback = (details: any) => {
    const tabRecords = this.data[this.currentTab];
    if (this.data[this.currentTab].enabled && this.currentTab === details.tabId) {
      this.updateBadgeText(this.currentTab, tabRecords.requests.length);
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
      store.dispatch(updateRequest(details.tabId, details));
      this.updateBadgeText(this.currentTab, tabRecords.requests.length);
      this.data[this.currentTab] = tabRecords;
    }
  };

  startTrackingRequests = (tabId: number) => {
    this.data[this.currentTab].enabled = true;
    store.dispatch(toggleListeningRequests(tabId, true));
    chrome.webRequest.onBeforeSendHeaders.addListener(
      this.callback,
      {
        urls: ["<all_urls>"],
        types: ["xmlhttprequest"]
      },
      ["requestHeaders"]
    );
  };

  stopTrackingRequests = (tabId: number) => {
    this.data[this.currentTab].enabled = false;
    store.dispatch(toggleListeningRequests(tabId, false));
  };

  clearData = (tabId: number) => {
    this.data[this.currentTab].requests = [];
    this.updateBadgeText(tabId, 0);
  };
}

new BackgroundWorker().startMessageListener();
