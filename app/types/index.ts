export interface POPUP_PROPS {
  tabId : number,
  tabUrl : string,
  enabled : boolean,
  requests : Array<any>,
  errorMessage : string,
  responseText : string,
  selectStatusCode :  string
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

export interface requestListProps extends POPUP_PROPS {
  requests: Array<chrome.webRequest.WebRequestDetails>;
  handleIntercept: React.MouseEventHandler<HTMLButtonElement>;
}

export interface requestChangeAction {
  request : object
  currentInput : string
}

