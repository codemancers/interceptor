export default class MessageService {
  // Outgoing
  enableLogging(url, tabId) {
    chrome.runtime.sendMessage({message: "ENABLE_LOGGING", url: url, tabId: tabId});
  }

  disableLogging(url, tabId) {
    //chrome.runtime.sendMessage({message: "DISABLE_LOGGING", url: url, tabId: tabId});
    // NOOP for now
  }

  logRequest(tabId, request) {
    chrome.tabs.sendMessage(tabId, {message: "LOG_REQUEST", request: request});
  }

  getStore(callback) {
    chrome.tabs.sendMessage(tabId, {message: "GET_STORE"}, callback)
  }

  getEnabledStatus(callback) {
    chrome.runtime.sendMessage({message: "GET_ENABLED_STATUS"}, callback);
  }

  getRequests(callback) {
    chrome.runtime.sendMessage({message: "GET_REQUESTS"}, callback);
  }

  getEnabledStatusForTab(tabId, callback) {
    chrome.runtime.sendMessage({message: "GET_ENABLED_STATUS", tabId: tabId}, callback);
  }

  // TODO: Extract message handlers from background.js and content_script.js
  // into this class and use callbacks to register message handlers
}
