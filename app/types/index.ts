export interface POPUP_PROPS {
  tabId : number
  tabUrl : string
  enabled : boolean
  requests : Array<any>
  errorMessage : string
  checkedReqs : object
  statusCodes: object
  responseText: object
  contentType: object
  PageDetails : object
  interceptStatus : string
  isInterceptorOn: interceptOn
}

export interface interceptOn{
  [tabId:number] : boolean
}

export interface selectCheckBoxes{
  [index: number]: boolean;
}

export interface PopUpState {
  enabled: boolean;
  errorMessage ?: string;
  requests: object;
  tabUrl : string;
  checkedReqs : object;
  responseText : object;
  statusCodes:object;
  isInterceptorOn:interceptOn;
}

export interface Action extends POPUP_PROPS{
  name ?: string
  value ?: any
  type: string
  payload ?:any
  checked :boolean
  reqId :number
  message: string
}

export interface requestListProps extends POPUP_PROPS {
  requests: Array<chrome.webRequest.WebRequestDetails>;
  handleCheckToggle : React.ChangeEventHandler<HTMLInputElement>
}

