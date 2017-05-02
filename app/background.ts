/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
import * as MessageService from './message_service'
import { RequestObj } from './request_list'

interface Data {
  tabId: number,
  enabled: boolean,
  requests: Array<RequestObj>
  count: number
};

const DEFAULT_DATA : Data = {
  tabId: -1,
  enabled: false,
  requests: [],
  count: 0
};

class BackgroundWorker {
  data : Array<Data> = [];

  findItem = (tabId : number) => {
    for (let index = 0; index < this.data.length; index++) {
      const data = this.data[index];

      if (Boolean(data) && data.tabId === tabId) {
        return data;
      }
    }

    return DEFAULT_DATA;
  }

  startMessageListener() {
    chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
      const tabId = request.tabId;
      const data = this.findItem(tabId);

      switch (request.message) {
        case 'ENABLE_LOGGING':
          this.enableLogging(request.tabId);
          break;
        case 'GET_ENABLED_STATUS':
          sendResponse(data.enabled);
          break;
        case 'GET_REQUESTS':
          sendResponse(data.requests);
          break;
      }
    });
  }

  startListeningToPageLoad() {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if(this.enabledForTab(tabId) && changeInfo.status == "loading") {
        this.resetData(tabId);
      }
    });
  }

  notifyForegroundWorker(tabId: number) {
    chrome.tabs.sendMessage(tabId, {message: "ENABLE_LOGGING"});
  }

  enableLogging(tabId: number) {
    this.notifyForegroundWorker(tabId);
    this.startTrackingRequests(tabId);
  }

  resetData(tabId: number) {
    this.data[tabId] = this.data[tabId] || {};
    this.data[tabId].count = 0;
    this.data[tabId].requests = [];
    MessageService.resetData(tabId);
  }

  enabledForTab(tabId: number) {
    return this.data[tabId] && this.data[tabId].enabled
  }

  startTrackingRequests(tabId: number) {
    this.resetData(tabId);
    this.data[tabId].enabled = true;
    chrome.webRequest.onBeforeRequest.addListener(
      (details) => {
        this.data[tabId].count += 1;
        this.data[tabId].requests.push(details);
        chrome.browserAction.setBadgeText({text: `${this.data[tabId].count}`, tabId: tabId});
        MessageService.logRequest(tabId, details);
      },
      {urls: ["<all_urls>"], types: ["xmlhttprequest"], tabId: tabId},
      ["blocking"]
    );
  }
}

let worker = new BackgroundWorker();
worker.startListeningToPageLoad();
worker.startMessageListener();
