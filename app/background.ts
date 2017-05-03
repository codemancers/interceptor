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
    for (let index = 0; index < this.data.length; index++) {
      const data = this.data[index];

      if (Boolean(data) && data.tabId === tabId) {
        return data;
      }
    }

    // Lazy code for object cloning
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
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
          sendResponse(data.requests);
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
      // This means that this is a new object. In this case, set the tabId to the current one.
      currentItem.tabId = tabId;
      currentItem.enabled = true;
    }

    // Insert the current object into the main list
    this.data.push(currentItem);

    chrome.webRequest.onBeforeRequest.addListener(
      (details) => {
        // Since this is a closure, the currentItem object when modified, will get reflected in the Array, thanks to JS.
        currentItem.count += 1;
        currentItem.requests.push(details);

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
      ["blocking"]
    );
  }
}

(new BackgroundWorker()).startMessageListener();
