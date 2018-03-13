export interface POPUP_PROPS {
  tabId : number,
  tabUrl : string,
  enabled : boolean,
  requests : Array<any>,
  errorMessage : string,
  checkedReqs : object,
  interceptStatus: Array<any>
  responseText: Array<any>
  contentType:Array<any>
}

export interface selectCheckBoxes{
  [index: number]: boolean;
}

export interface PopUpState {
  enabled: boolean;
  errorMessage ?: string;
  requests: object;
  tabUrl ?: string;
  checkedReqs : object;
  responseText : object;
  interceptStatus:object;
}

export interface Action{
  name ?: string
  value ?: any
  type: string
  payload ?:any
  checked :boolean
  reqId :number
}

export interface requestListProps extends POPUP_PROPS {
  requests: Array<chrome.webRequest.WebRequestDetails>;
  handleCheckToggle : React.ChangeEventHandler<HTMLInputElement>
}

