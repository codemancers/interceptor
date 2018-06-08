enum interceptStatus {
  Success = "Interception Success!",
  Fail = "Interception Disabled!"
}
export interface POPUP_PROPS {
  currentTab: number;
  currentUrl: string;
  interceptStatus: interceptStatus;
  tabRecord: any;
  requestRecords: any;
}

export interface interceptOn {
  [tabId: number]: boolean;
}

export interface selectCheckBoxes {
  [index: number]: boolean;
}

export interface Action extends POPUP_PROPS {
  type: string;
  payload?: any;
}

export interface requestListProps extends POPUP_PROPS {
  requests: Array<chrome.webRequest.WebRequestDetails>;
  handleCheckToggle: React.ChangeEventHandler<HTMLInputElement>;
}
