// Outgoing
export function enableLogging(url, tabId) {
  chrome.runtime.sendMessage({message: "ENABLE_LOGGING", url: url, tabId: tabId});
}

export function disableLogging(url, tabId) {
  //chrome.runtime.sendMessage({message: "DISABLE_LOGGING", url: url, tabId: tabId});
  // NOOP for now
}

export function logRequest(tabId, request) {
  chrome.tabs.sendMessage(tabId, {message: "LOG_REQUEST", request: request});
}

export function resetData(tabId) {
  chrome.tabs.sendMessage(tabId, {message: "RESET_DATA"});
}

export function getStore(callback) {
  chrome.tabs.sendMessage(tabId, {message: "GET_STORE"}, callback)
}

export function getEnabledStatus(callback) {
  chrome.runtime.sendMessage({message: "GET_ENABLED_STATUS"}, callback);
}

export function getRequests(callback) {
  chrome.runtime.sendMessage({message: "GET_REQUESTS"}, callback);
}

export function getEnabledStatusForTab(tabId, callback) {
  chrome.runtime.sendMessage({message: "GET_ENABLED_STATUS", tabId: tabId}, callback);
}

// TODO: Extract message handlers from background.js and content_script.js
// into this class and use callbacks to register message handlers