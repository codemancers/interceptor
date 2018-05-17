export type GenericCallback = (_: any) => void;

// Outgoing
export function enableLogging(url: string, tabId: number) {
  chrome.runtime.sendMessage({ message: "ENABLE_LOGGING", url, tabId });
}

export function disableLogging(url: string, tabId: number) {
  chrome.runtime.sendMessage({ message: "DISABLE_LOGGING", url, tabId });
}

export function getEnabledStatus(tabId: number, callback: GenericCallback) {
  chrome.runtime.sendMessage({ message: "GET_ENABLED_STATUS", tabId }, callback);
}

export function getRequests(tabId: number, callback: GenericCallback) {
  chrome.runtime.sendMessage({ message: "GET_REQUESTS", tabId }, {}, callback);
}
export function clearData(tabId: number) {
  chrome.runtime.sendMessage({ message: "CLEAR_DATA", tabId });
}
export function interceptChecked(tabId: number, requests: Array<any>) {
  chrome.tabs.sendMessage(tabId, {
    message: "INTERCEPT_CHECKED",
    requestsToIntercept: requests,
    tabId
  });
}
export function disableInterceptor(tabId: number) {
  chrome.tabs.sendMessage(tabId, { message: "DISABLE_INTERCEPTOR", tabId });
}
export function updateBadgeIcon(tabId: number, disabledStatus: boolean) {
  chrome.runtime.sendMessage({ message: "UPDATE_BADGE_ICON", tabId, disabledStatus });
}
