/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
import * as MessageService from './message_service'
import { RequestObj } from './request_list'

interface Data {
  enabled: boolean,
  requests: Array<RequestObj>
  count: number
}

class BackgroundWorker {
  data: Array<Data>

  constructor() {
    this.data = [];
  }

  startMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (!request.tabId || !sender.tab || !sender.tab.id) {
        return;
      }

      const tabId = request.tabId || sender.tab.id;
      switch (request.message) {
        case 'ENABLE_LOGGING':
          this.enableLogging(request.tabId);
          break;
        case 'GET_ENABLED_STATUS':
          if(this.data[tabId]) {
            sendResponse(this.data[tabId].enabled);
          } else {
            sendResponse(false);
          }
          break;
        case 'GET_REQUESTS':
          if(this.data[tabId]) {
            sendResponse(this.data[tabId].requests);
          } else {
            sendResponse([]);
          }
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
