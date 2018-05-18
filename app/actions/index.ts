//ACTION CONSTANTS
export const START_LISTENING = "START_LISTENING";
export const STOP_LISTENING = "STOP_LISTENING";
export const ERROR = "ERROR";
export const DEFAULT_ACTION = "DEFAULT";
export const CLEAR_REQUESTS = "CLEAR_REQUESTS";
export const RELOAD_REQUESTS = "RELOAD_REQUESTS";
export const UPDATE_FIELD = "UPDATE_FIELD";
export const UPDATE_FIELDS = "UPDATE_FIELDS";
export const TOGGLE_CHECKBOX = "TOGGLE_CHECKBOX";
export const INTERCEPT_CHECKED = "INTERCEPT_CHECKED";
export const STATUSCODE_CHANGE = "STATUSCODE_CHANGE";
export const RESP_TEXT_CHANGE = "RESP_TEXT_CHANGE";
export const CONTENT_TYPE_CHANGE = "CONTENT_TYPE_CHANGE";
export const PAGINATION_CHANGE = "PAGINATION_CHANGE";
export const UPDATE_MESSAGE = "UPDATE_MESSAGE";
export const UPDATE_INTERCEPTOR_STATUS = "UPDATE_INTERCEPTOR_STATUS";
export const FETCH_DATA = "FETCH_DATA";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_DATA_FAILURE = "FETCH_DATA_FAILURE";
export const UPDATE_REQUEST = "UPDATE_REQUEST";

// Action Creators
export function startListening(enabledStatus: boolean) {
  return { type: START_LISTENING, payload: enabledStatus };
}
export function updateField(name: string, value: any) {
  return { type: UPDATE_FIELD, payload: { name, value } };
}
export function updateFields(payload: object) {
  return { type: UPDATE_FIELDS, payload };
}
export function stopListening(enabledStatus: boolean) {
  return { type: STOP_LISTENING, payload: enabledStatus };
}
export function errorNotify(errorMessage: string) {
  return { type: ERROR, errorMessage };
}
export function clearFields(tabId: number) {
  return { type: CLEAR_REQUESTS, payload: { tabId } };
}
export function handleCheckToggle(reqId: number, checked: boolean) {
  return { type: TOGGLE_CHECKBOX, payload: { reqId, checked } };
}
export function handleCheckedRequests(tabId: number, requests: Array<any>) {
  return { type: INTERCEPT_CHECKED, payload: requests };
}
export function handleStatusCodeChange(value: string, requestId: string) {
  return { type: STATUSCODE_CHANGE, payload: { value, requestId } };
}
export function handleRespTextChange(value: string, requestId: string) {
  return { type: RESP_TEXT_CHANGE, payload: { value, requestId } };
}
export function handleContentTypeChange(value: string, requestId: string) {
  return { type: CONTENT_TYPE_CHANGE, payload: { value, requestId } };
}
export function handlePaginationChange(value: string, tabId: number, field: string) {
  return { type: PAGINATION_CHANGE, payload: { field, value, tabId } };
}
export function sendMessageToUI(message: string) {
  return { type: UPDATE_MESSAGE, message };
}
export function updateInterceptorStatus(tabId: number, value: boolean) {
  return { type: UPDATE_INTERCEPTOR_STATUS, payload: { tabId, value } };
}
export function fetchResponse(requestDetails: chrome.webRequest.WebRequestHeadersDetails) {
  return {
    type: FETCH_DATA,
    requestDetails
  };
}
export function fetchSuccess(data: string, requestId: string) {
  return { type: FETCH_DATA_SUCCESS, payload: { response: data, requestId } };
}
export function fetchFailure(error: string, requestId: string) {
  return { type: FETCH_DATA_FAILURE, payload: { error: error, requestId } };
}
export function updateRequests(payload: any) {
  return { type: UPDATE_REQUEST, payload };
}
