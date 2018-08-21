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
  chrome.tabs.sendMessage(tabId, { message: "CLEAR_DATA" });
}

export function interceptChecked(tabId: number) {
  chrome.tabs.sendMessage(tabId, {
    message: "INTERCEPT_CHECKED",
    tabId
  });
}

export function disableInterceptor(tabId: number) {
  chrome.tabs.sendMessage(tabId, { message: "DISABLE_INTERCEPTOR", tabId });
}

export function updateBadgeIcon(tabId: number, disabledStatus: boolean) {
  chrome.runtime.sendMessage({ message: "UPDATE_BADGE_ICON", tabId, disabledStatus });
}

export function updateBadgeText(tabId: number, count: number) {
  chrome.runtime.sendMessage({ message: "UPDATE_BADGE_TEXT", tabId, count });
}
