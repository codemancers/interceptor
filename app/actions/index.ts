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

// Action Creators
export function startListening (enabledStatus:boolean){
  return {type : START_LISTENING, enabled : enabledStatus}
}
export function updateField (name:string, value:any) {
  return {type : UPDATE_FIELD, name, value }
}
export function updateFields (payload:object) {
  return {type : UPDATE_FIELDS, payload  }
}
export function stopListening (enabledStatus:boolean){
  return { type : STOP_LISTENING, enabled: enabledStatus}
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
export function handleStatusCodeChange(value:string, rowIndex:number){
  return {type: STATUSCODE_CHANGE , payload : {value, rowIndex} }
}
export function handleRespTextChange(value:string, rowIndex:number){
  return {type: RESP_TEXT_CHANGE , payload : {value, rowIndex} }
}