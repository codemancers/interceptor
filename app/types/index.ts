export interface POPUP_PROPS {
  tabId : number,
  tabUrl : string,
  enabled : boolean,
  requests : Array<any>,
  errorMessage : string,
  selectedReqIds : Array<number>,
  checked : Array<boolean>
}

export interface selectCheckBoxes{
  [index: number]: boolean;
}

export interface PopUpState {
  enabled: boolean;
  errorMessage ?: string;
  requests: object;
  tabUrl ?: string
  selectedReqIds : Array<number>
  checked :Array<boolean>
}

export interface Action{
  name ?: string
  value ?: any
  type: string
  payload ?:object
  checked :boolean
  reqId :number
}

export interface requestListProps extends POPUP_PROPS {
  requests: Array<chrome.webRequest.WebRequestDetails>;
  handleIntercept: React.MouseEventHandler<HTMLButtonElement>;
  handleCheckToggle : React.ChangeEventHandler<HTMLInputElement>
}

