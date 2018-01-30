import {PopUpState} from '../types'
//ACTION CONSTANTS
export const  START_LISTENING = "START_LISTENING";
export const STOP_LISTENING = "STOP_LISTENING";
export const  ERROR = "ERROR";
export const  DEFAULT_ACTION = "DEFAULT";
export const CLEAR_REQUESTS = "CLEAR_REQUESTS"
export const RELOAD_REQUESTS = "RELOAD_REQUESTS"
export const  UPDATE_FIELD = "UPDATE_FIELD";
export const  UPDATE_FIELDS = "UPDATE_FIELDS";

// Action Creators

export function startListening (enabledStatus:PopUpState["enabled"]){
  return {type : START_LISTENING, enabled : enabledStatus}
}
export function updateField (name:string, value:any) {
  return {type : UPDATE_FIELD, [name]: value  }
}
export function updateFields (payload:object) {
  return {type : UPDATE_FIELDS, payload  }
}
export function stopListening (enabledStatus:PopUpState["enabled"]){ 
  return { type : STOP_LISTENING, enabled: enabledStatus}
 }
export function errorNotify (errorMessage:string) {
  return { type : ERROR ,  errorMessage}
}
export function clearFields(){
   return {type : CLEAR_REQUESTS}
}