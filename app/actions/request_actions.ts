//ACTION CONSTANTS
export const  HANDLE_URL_CHANGE = "HANDLE_URL_CHANGE";
export const STOP_LISTENING = "STOP_LISTENING";
export const  ERROR = "ERROR";
export const  DEFAULT_ACTION = "DEFAULT";
export const CLEAR_REQUESTS = "CLEAR_REQUESTS"
export const RELOAD_REQUESTS = "RELOAD_REQUESTS"
export const  UPDATE_FIELD = "UPDATE_FIELD";
export const  UPDATE_FIELDS = "UPDATE_FIELDS";

// Action Creators
export function handleUrlChange (input:string){
  return {type : HANDLE_URL_CHANGE, input : input}
}