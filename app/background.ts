/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
import { RequestObj } from './request_list'

interface Data {
  tabId: number,
  enabled: boolean,
  requests: Array<RequestObj>
  count: number
};

interface data {
  [index: number]: Data;
}

class BackgroundWorker {
  currentTab:number = -1
  data:data
  constructor() {
    this.data = {};
    this.callback = this.callback.bind(this);
    this.startTrackingRequests = this.startTrackingRequests.bind(this);
    this.stopTrackingRequests = this.stopTrackingRequests.bind(this);
  }

  startMessageListener() {
    chrome.browserAction.setBadgeText({
      text: `${this.data[this.currentTab].count}`,
      tabId : this.data[this.currentTab].tabId
    });
    chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
      this.currentTab = request.tabId;
      if (!this.data[this.currentTab]) {
        this.data[this.currentTab] = {
          enabled: false,
          requests: [],
          tabId : -1,
          count: 0
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
          sendResponse(this.data[this.currentTab].tabId);
          break
        }
      }
    });
  }

  callback(details:any) {
    const tabRecords = this.data[this.currentTab];
    if (tabRecords.enabled && this.currentTab === details.tabId) {
      tabRecords.requests.push(details);
      tabRecords.count += 1 
      this.data[this.currentTab] = tabRecords;
    }
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