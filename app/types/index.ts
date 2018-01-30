import {RequestObj} from './../request_list'
export interface POPUP_PROPS {
  tabId : number,
  tabUrl : string,
  enabled : boolean,
  requests : Array<RequestObj>,
  errorMessage : string
}

export interface PopUpState {
  enabled: boolean;
  errorMessage ?: string;
  requests: object;
  tabUrl ?: string
}

export interface Action extends PopUpState{
  name ?: string
  value ?: any
  type: string
  payload ?:object
}

