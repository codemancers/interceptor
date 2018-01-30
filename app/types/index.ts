export type POPUP_PROPS = {
  tabId : number,
  tabUrl : string,
  enabled : boolean,
  requests : object,
  errorMessage : string
}

export interface PopUpState {
  enabled: boolean;
  errorMessage ?: string;
  requests: object;
  tabUrl ?: string
}

export interface Action extends PopUpState{
  name : string
  value : any
  type: string
}

