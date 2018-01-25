/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
import { RequestObj } from './request_list'

interface TabRecord {
  tabId: number,
  enabled: boolean,
  requests: Array<RequestObj>
};

interface Recordings {
  [index: number]: TabRecord;
}

class BackgroundWorker {
  currentTab:number = -1
  data:Recordings
  constructor() {
    this.data = {};
    this.callback = this.callback.bind(this);
    this.startTrackingRequests = this.startTrackingRequests.bind(this);
    this.stopTrackingRequests = this.stopTrackingRequests.bind(this);
  }

  startMessageListener() {
    chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
      this.currentTab = request.tabId;
      if (!this.data[this.currentTab]) {
        this.data[this.currentTab] = {
          enabled: false,
          requests: [],
          tabId : -1,
        };
      }
      switch (request.message) {
        case 'ENABLE_LOGGING': {
          this.startTrackingRequests();
          break;
        }
        case 'GET_ENABLED_STATUS': {
          const data = this.data[this.currentTab];
          sendResponse(data.enabled);
          break;
        }
        case 'DISABLE_LOGGING': {
          this.stopTrackingRequests();
          break;
        }
        case 'GET_REQUESTS': {
          sendResponse(this.data[this.currentTab].requests);
          break;
        }
        case 'GET_COUNT' : {
          sendResponse(this.data[this.currentTab].requests.length);
          break
        }
      }
    });
  }

  callback(details:any) {
    const tabRecords = this.data[this.currentTab];
    if (tabRecords.enabled && this.currentTab === details.tabId) {
      tabRecords.requests.push(details);
      this.data[this.currentTab] = tabRecords;
    }
    chrome.browserAction.setBadgeText({
      text: `${tabRecords.requests.length}`,
      tabId : details.tabId,
    });
  }

  startTrackingRequests() {
    this.data[this.currentTab].enabled = true;
    chrome.webRequest.onBeforeRequest.addListener(
      this.callback, 
      {
        urls: ["<all_urls>"],
        types: ["xmlhttprequest"],
      },
      ["requestBody"]
    );
  }

  stopTrackingRequests() {
    const tabRecords = this.data[this.currentTab];
    tabRecords.enabled = false;
    this.data[this.currentTab] = tabRecords;
  }
}

(new BackgroundWorker()).startMessageListener();