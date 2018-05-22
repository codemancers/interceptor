import { wrapStore } from "react-chrome-redux";

import { INITIAL_POPUP_STATE } from "./../reducers/rootReducer";
import store from "./../store/popup_store";
export const createStore = store({ ...INITIAL_POPUP_STATE });
import { toggleListeningRequests, updateRequests } from "./../actions";

interface TabRecord {
  tabId: number;
  enabled: boolean;
  requests: Array<chrome.webRequest.WebRequestDetails>;
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
        case "SET_BADGE_ZERO": {
          this.updateBadgeText(request.tabId, 0);
          break;
        }
        case "ENABLE_LOGGING": {
          this.startTrackingRequests(request.tabId);
          break;
        }
        case "DISABLE_LOGGING": {
          this.stopTrackingRequests(request.tabId);
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

  updateBadgeText = (tabId: number, requestsLength: number) => {
    chrome.browserAction.setBadgeText({
      text: `${requestsLength}`,
      tabId: tabId
    });
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
      createStore.dispatch(updateRequests(details.tabId, tabRecords.requests));
      this.updateBadgeText(this.currentTab, tabRecords.requests.length);
      this.data[this.currentTab] = tabRecords;
    }
  };

  startTrackingRequests = (tabId: number) => {
    this.data[this.currentTab].enabled = true;
    createStore.dispatch(toggleListeningRequests(tabId, true));
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

  stopTrackingRequests = (tabId: number) => {
    this.data[this.currentTab].enabled = false;
    createStore.dispatch(toggleListeningRequests(tabId, false));
  };
}

new BackgroundWorker().startMessageListener();
