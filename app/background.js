import MessageService from './message_service'

class BackgroundWorker {

  constructor() {
    this.data = {};
    this.messageService = new MessageService();
  }

  startMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log(`Received message ${request.message}`);
      if(request.message == "ENABLE_LOGGING"){
        this.enableLogging(request.tabId);
      }
    });
  }

  //monitorTabsForEnabledUrls() {
    //chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      //if(changeInfo.status == "loading") {
        //this.startTrackingRequests(tabId);
      //}
    //});
  //}

  enableLogging(tabId) {
    this.startTrackingRequests(tabId);
  }

  resetData(tabId) {
    this.data[tabId] = {count: 0, requests: []};
  }

  startTrackingRequests(tabId) {
    console.log(`Starting tracking for tab: ${tabId}`);
    this.resetData(tabId);
    chrome.webRequest.onBeforeRequest.addListener(
      (details) => {
        this.data[tabId].count += 1;
        chrome.browserAction.setBadgeText({text: '' + this.data[tabId].count, tabId: tabId});
        this.messageService.logRequest(tabId, details);
      },
      {urls: ["<all_urls>"], types: ["xmlhttprequest"], tabId: tabId},
      ["blocking"]
    );
  }
}

let worker = new BackgroundWorker();
worker.startMessageListener();
//worker.monitorTabsForEnabledUrls();
