import {PopUpState} from '../types'
//ACTION CONSTANTS
export const  START_LISTENING = "START_LISTENING";
export const STOP_LISTENING = "STOP_LISTENING";
export const  ERROR = "ERROR";
export const  DEFAULT_ACTION = "DEFAULT";
export const CLEAR_REQUESTS = "CLEAR_REQUESTS"
export const RELOAD_REQUESTS = "RELOAD_REQUESTS"
export const  UPDATE_FIELD = "UPDATE_FIELD";

// Action Creators

export function startListening (enabledStatus:PopUpState["enabled"]){
  return {type : START_LISTENING, enabled : enabledStatus}
}

export function updateField (requests:PopUpState["requests"]) {
  return {type : UPDATE_FIELD, requests}
}

export function stopListening (enabledStatus:PopUpState["enabled"]){ 
  return { type : STOP_LISTENING, enabled: enabledStatus}
 }
export function errorNotify (tabUrl:PopUpState["tabUrl"]) {
  return { type : ERROR ,  tabUrl  }
}
export function clearFields(){
   return {type : CLEAR_REQUESTS}
}