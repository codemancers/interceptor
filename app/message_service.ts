import { RequestObj } from './request_list';
type GenericCallback = (_: any) => void;

// Outgoing
export function enableLogging(url: string, tabId: number) {
  chrome.runtime.sendMessage({ message: "ENABLE_LOGGING", url: url, tabId: tabId });
}

export function disableLogging(url: string, tabId: number) {
  chrome.runtime.sendMessage({ message: "DISABLE_LOGGING", url: url, tabId: tabId });
}

export function logRequest(tabId: number, request: RequestObj) {
  chrome.tabs.sendMessage(tabId, {message: "LOG_REQUEST", request: request});
}

export function resetData(tabId: number) {
  chrome.tabs.sendMessage(tabId, {message: "RESET_DATA"});
}

export function getEnabledStatus(callback: GenericCallback) {
  chrome.runtime.sendMessage({message: "GET_ENABLED_STATUS"}, callback);
}

export function getRequests(tabId:number, callback: GenericCallback) {
  chrome.runtime.sendMessage(chrome.runtime.id, {message: "GET_REQUESTS", tabId: tabId }, {}, callback);
}

export function getEnabledStatusForTab(tabId: number, callback: GenericCallback) {
  chrome.runtime.sendMessage({message: "GET_ENABLED_STATUS", tabId: tabId}, callback);
}

// TODO: Extract message handlers from background.js and content_script.js
// into this class and use callbacks to register message handlers