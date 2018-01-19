/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
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
    // Not using a polyfill because this is supported in Chrome v. > 45. We
    // might have to add some restriction in manifest related to this
    const data = this.data.find(item => item.tabId === tabId) || DEFAULT_DATA;

    // Lazy code for object cloning
    return JSON.parse(JSON.stringify(data));
  }

  startMessageListener() {
    chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
      const tabId = request.tabId;
      switch (request.message) {
        case 'ENABLE_LOGGING':
          this.startTrackingRequests(tabId);
          break;
        case 'GET_ENABLED_STATUS': {
          const data = this.findItem(tabId);
          sendResponse(data.enabled);
        }
        break;
        case 'GET_REQUESTS': {
          const data = this.findItem(tabId);
          sendResponse(data);

        }
        break;
      }
    });
  }

  enabledForTab(tabId: number) {
    return this.findItem(tabId).enabled;
  }

  startTrackingRequests(tabId: number) {
    const currentItem = this.findItem(tabId);
    if (currentItem.tabId === DEFAULT_DATA.tabId) {
      // This means that this is a new object. In this case, set the tabId to
      // the current one.
      currentItem.tabId = tabId;
      currentItem.enabled = true;
    }

    // Insert the current object into the main list
    this.data.push(currentItem);
    

    chrome.webRequest.onHeadersReceived.addListener(
      (details) => {
        // Since this is a closure, the currentItem object when modified, will
        // get reflected in the Array, thanks to JS.
        currentItem.count += 1;
        console.log(details.responseHeaders)
        currentItem.requests.push(details.responseHeaders);
        chrome.browserAction.setBadgeText({
          text: `${currentItem.count}`,
          tabId
        });
      },
      {
        urls: ["<all_urls>"],
        types: ["xmlhttprequest"],
        tabId: tabId
      },
      ["blocking", "responseHeaders"]
    );
  }
}

(new BackgroundWorker()).startMessageListener();
