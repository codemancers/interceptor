import MessageService from './message_service'

class BackgroundWorker {

  constructor() {
    this.data = {};
    this.messageService = new MessageService();
  }

  startMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      let tabId = request.tabId || sender.tab.id;
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
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if(this.enabledForTab(tabId) && changeInfo.status == "loading") {
        this.resetData(tabId);
      }
    });
  }

  notifyForegroundWorker(tabId) {
    chrome.tabs.sendMessage(tabId, {message: "ENABLE_LOGGING"});
  }

  enableLogging(tabId) {
    this.notifyForegroundWorker(tabId);
    this.startTrackingRequests(tabId);
  }

  resetData(tabId) {
    this.data[tabId] = this.data[tabId] || {};
    this.data[tabId].count = 0;
    this.data[tabId].requests = [];
  }

  enabledForTab(tabId) {
    return this.data[tabId] && this.data[tabId].enabled
  }

  startTrackingRequests(tabId) {
    this.resetData(tabId);
    this.data[tabId].enabled = true;
    chrome.webRequest.onBeforeRequest.addListener(
      (details) => {
        this.data[tabId].count += 1;
        this.data[tabId].requests.push(details);
        chrome.browserAction.setBadgeText({text: `${this.data[tabId].count}`, tabId: tabId});
        this.messageService.logRequest(tabId, details);
      },
      {urls: ["<all_urls>"], types: ["xmlhttprequest"], tabId: tabId},
      ["blocking"]
    );
  }
}

let worker = new BackgroundWorker();
worker.startListeningToPageLoad();
worker.startMessageListener();
