//ACTION CONSTANTS
export const  START_LISTENING = "START_LISTENING";
export const STOP_LISTENING = "STOP_LISTENING";
export const  ERROR = "ERROR";
export const  DEFAULT_ACTION = "DEFAULT";
export const CLEAR_REQUESTS = "CLEAR_REQUESTS"
export const RELOAD_REQUESTS = "RELOAD_REQUESTS"
export const  UPDATE_FIELD = "UPDATE_FIELD";
export const  UPDATE_FIELDS = "UPDATE_FIELDS";
export const TOGGLE_CHECKBOX = "TOGGLE_CHECKBOX"
export const INTERCEPT_CHECKED = "INTERCEPT_CHECKED"
export const STATUSCODE_CHANGE = "STATUSCODE_CHANGE"
export const RESP_TEXT_CHANGE = "RESP_TEXT_CHANGE"
export const CONTENT_TYPE_CHANGE = "CONTENT_TYPE_CHANGE"
export const PAGINATION_CHANGE = "PAGINATION_CHANGE"
export const INTERCEPT_SUCCESS = "INTERCEPT_SUCCESS"

// Action Creators
export function startListening (enabledStatus:boolean){
  return {type : START_LISTENING, payload : enabledStatus}
}
export function updateField (name:string, value:any) {
  return {type : UPDATE_FIELD, payload : {name, value} }
}
export function updateFields (payload:object) {
  return {type : UPDATE_FIELDS, payload  }
}
export function stopListening (enabledStatus:boolean){
  return { type : STOP_LISTENING, payload: enabledStatus}
 }
export function errorNotify (errorMessage:string) {
  return { type : ERROR ,  errorMessage}
}
export function clearFields(){
   return {type : CLEAR_REQUESTS}
}
export function handleCheckToggle(reqId:number, checked:boolean){
  return {type : TOGGLE_CHECKBOX, reqId, checked  }
}
export function handleCheckedRequests(tabId:number,requests:Array<any>){
  return {type: INTERCEPT_CHECKED , payload : requests}
}
export function handleStatusCodeChange(value:string, requestId:number){
  return {type: STATUSCODE_CHANGE , payload : {value, requestId} }
}
export function handleRespTextChange(value:string, requestId:number){
  return {type: RESP_TEXT_CHANGE , payload : {value, requestId} }
}
export function handleContentTypeChange(value:string, requestId:number){
  return {type : CONTENT_TYPE_CHANGE, payload : {value, requestId}}
}
export function handlePaginationChange(value: string, tabId:number, field:string) {
  return {type: PAGINATION_CHANGE, payload: {field, value, tabId}};
}
export function sendSuccessMessage(){
  return {type : INTERCEPT_SUCCESS }
}