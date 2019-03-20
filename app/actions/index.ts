import { newRequestFields } from "../types";

//ACTION CONSTANTS
export const ERROR = "ERROR";
export const CLEAR_REQUESTS = "CLEAR_REQUESTS";
export const TOGGLE_CHECKBOX = "TOGGLE_CHECKBOX";
export const STATUSCODE_CHANGE = "STATUSCODE_CHANGE";
export const RESP_TEXT_CHANGE = "RESP_TEXT_CHANGE";
export const CONTENT_TYPE_CHANGE = "CONTENT_TYPE_CHANGE";
export const PAGINATION_CHANGE = "PAGINATION_CHANGE";
export const UPDATE_MESSAGE = "UPDATE_MESSAGE";
export const UPDATE_INTERCEPTOR_STATUS = "UPDATE_INTERCEPTOR_STATUS";
export const FETCH_DATA = "FETCH_DATA";
export const FETCH_DATA_IN_PROGRESS = "FETCH_DATA_IN_PROGRESS";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_DATA_FAILURE = "FETCH_DATA_FAILURE";
export const UPDATE_REQUEST = "UPDATE_REQUEST";
export const TOGGLE_LISTENING = "TOGGLE_LISTENING";
export const INITIALISE_DEFAULTS = "INITIALISE_DEFAULTS";
export const TOGGLE_SHOW_ADD_REQUEST = "TOGGLE_SHOW_ADD_REQUEST";
export const CHANGE_URL_TABLE = "CHANGE_URL_TABLE";

// Action Creators
export function errorNotify(errorMessage: string, tabId: number) {
  return { type: ERROR, payload: { errorMessage, tabId } };
}

export function clearFields(tabId: number) {
  return { type: CLEAR_REQUESTS, payload: { tabId } };
}
export function handleCheckToggle(tabId: number, reqId: number, checked: boolean) {
  return { type: TOGGLE_CHECKBOX, payload: { tabId, reqId, checked } };
}
export function handleStatusCodeChange(value: string, requestId: string, tabId: number) {
  return { type: STATUSCODE_CHANGE, payload: { value, requestId, tabId } };
}
export function handleRespTextChange(value: string, requestId: string, tabId: number) {
  return { type: RESP_TEXT_CHANGE, payload: { value, requestId, tabId } };
}
export function handleContentTypeChange(value: string, requestId: string, tabId: number) {
  return { type: CONTENT_TYPE_CHANGE, payload: { value, requestId, tabId } };
}
export function handlePaginationChange(value: string, tabId: number, field: string) {
  return { type: PAGINATION_CHANGE, payload: { field, value, tabId } };
}
export function sendMessageToUI(message: string, tabId: number) {
  return { type: UPDATE_MESSAGE, payload: { message, tabId } };
}
export function updateInterceptorStatus(tabId: number, value: boolean) {
  return { type: UPDATE_INTERCEPTOR_STATUS, payload: { tabId, value } };
}
export function fetchingResponse(
  tabId: number,
  requestId:any,
  fetching: boolean
){
  return {
    type: FETCH_DATA_IN_PROGRESS,
    payload:{
      tabId,
      requestId,
      fetching
    }
  }
}
export function fetchResponse(
  requestDetails: chrome.webRequest.WebRequestHeadersDetails,
  tabId: number
) {
  return {
    type: FETCH_DATA,
    payload: { requestDetails, tabId }
  };
}
export function fetchSuccess(data: string, requestId: string, tabId: number) {
  return { type: FETCH_DATA_SUCCESS, payload: { response: data, requestId, tabId } };
}
export function fetchFailure(error: string, requestId: string, tabId: number) {
  return { type: FETCH_DATA_FAILURE, payload: { error: error, requestId, tabId } };
}
export function updateRequest(
  tabId: number,
  request: Array<chrome.webRequest.WebRequestDetails | newRequestFields>
) {
  return { type: UPDATE_REQUEST, payload: { tabId, request } };
}
export function toggleListeningRequests(tabId: number, enabledStatus: boolean) {
  return { type: TOGGLE_LISTENING, payload: { tabId, enabledStatus } };
}
export function initialiseDefaults(
  currentTab: number,
  currentUrl: string,
  interceptStatus: string
) {
  return {
    type: INITIALISE_DEFAULTS,
    payload: { currentTab, currentUrl, interceptStatus }
  };
}

export const toggleAddRequestForm = (showAddRuleModal: boolean) => {
  return {
    type: TOGGLE_SHOW_ADD_REQUEST,
    payload: { showAddRuleModal }
  };
};
export const handleChangeUrl = (value: string, tabId: number, index: number) => {
  return { type: CHANGE_URL_TABLE, payload: { value, tabId, index } };
};
