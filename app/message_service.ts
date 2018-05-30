export type GenericCallback = (_: any) => void;

// Outgoing
export function enableLogging(tabId: number) {
  chrome.runtime.sendMessage({ message: "ENABLE_LOGGING", tabId });
}
export function disableLogging(tabId: number) {
  chrome.runtime.sendMessage({ message: "DISABLE_LOGGING", tabId });
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
