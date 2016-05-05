export default class MessageService {
  enableLogging(url, tabId) {
    console.log("Sending message to enable logging");
    chrome.runtime.sendMessage({message: "ENABLE_LOGGING", url: url, tabId: tabId});
  }

  disableLogging(url, tabId) {
    //chrome.runtime.sendMessage({message: "DISABLE_LOGGING", url: url, tabId: tabId});
    // NOOP for now
  }

  logRequest(tabId, request) {
    chrome.tabs.sendMessage(tabId, {message: "LOG_REQUEST", request: request});
  }

  getStore(tabId, callback) {
    chrome.tabs.sendMessage(tabId, {message: "GET_STORE"}, callback)
  }
}
