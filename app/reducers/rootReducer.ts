import { POPUP_PROPS, Action } from "../types";
import * as actionType from "../actions";

export const INITIAL_POPUP_STATE: POPUP_PROPS = {
  tabRecord: {},
  currentUrl: "",
  currentTab: -1,
  showAddRuleModal: false
};

const initialTabProperties = {
  enabledStatus: false,
  requests: [],
  errorMessage: "",
  PageDetails: {
    currentRowSize: 10,
    currentPageNumber: 0
  },
  checkedReqs: {},
  isInterceptorOn: true,
  requestRecords: {}
};

const initialRequestProperties = {
  serverResponse: "",
  responseError: "",
  serverError: "",
  contentType: "",
  responseText: "",
  statusCode: ""
};

function extendTabRecords(state: POPUP_PROPS, payload: any, newTabRecords: any) {
  return {
    ...state,
    tabRecord: {
      ...state.tabRecord,
      [payload.tabId]: {
        ...state.tabRecord[payload.tabId],
        ...newTabRecords
      }
    }
  };
}

function changeRequestUrl(state: POPUP_PROPS, payload: any) {
  const requests = [...state.tabRecord[payload.tabId].requests];
  requests[payload.index].url = payload.value;
  return {
    ...state,
    tabRecord: {
      ...state.tabRecord,
      [payload.tabId]: {
        ...state.tabRecord[payload.tabId],
        requests: requests
      }
    }
  };
}

function requestsReducer(state: POPUP_PROPS, payload: any, newRequest: any) {
  return {
    ...state,
    tabRecord: {
      ...state.tabRecord,
      [payload.tabId]: {
        ...state.tabRecord[payload.tabId],
        requests: [...state.tabRecord[payload.tabId].requests, ...newRequest],
        requestRecords: {
          ...state.tabRecord[payload.tabId].requestRecords,
          [payload.request.requestId]: {
            ...(state.tabRecord[payload.tabId].requestRecords[payload.tabId] ||
              initialRequestProperties)
          }
        }
      }
    }
  };
}

function extendRequestRecords(state: POPUP_PROPS, payload: any, newRequestRecords: any) {
  return {
    ...state,
    tabRecord: {
      ...state.tabRecord,
      [payload.tabId]: {
        ...state.tabRecord[payload.tabId],
        requestRecords: {
          ...state.tabRecord[payload.tabId].requestRecords,
          [payload.requestId]: {
            ...state.tabRecord[payload.tabId].requestRecords[payload.requestId],
            ...newRequestRecords
          }
        }
      }
    }
  };
}

//ACTION CONSTANTS
export const reducer = (state = INITIAL_POPUP_STATE, action: Action) => {
  switch (action.type) {
    case actionType.INITIALISE_DEFAULTS:
      return {
        ...state,
        tabRecord: {
          ...state.tabRecord,
          [action.payload.currentTab]: {
            ...(state.tabRecord[action.payload.currentTab] || initialTabProperties)
          }
        },
        currentUrl: action.payload.currentUrl,
        currentTab: action.payload.currentTab,
        interceptStatus: action.payload.interceptStatus
      };
    case actionType.TOGGLE_SHOW_ADD_REQUEST: {
      return {
        ...state,
        showAddRuleModal: action.payload.showAddRuleModal
      };
    }
    case actionType.ERROR:
      return extendTabRecords(state, action.payload, {
        errorMessage: action.payload.errorMessage,
        enabledStatus: false
      });
    case actionType.CLEAR_REQUESTS:
      return extendTabRecords(state, action.payload, {
        requests: [],
        requestRecords: {},
        checkedReqs: {}
      });
    case actionType.TOGGLE_CHECKBOX:
      return extendTabRecords(state, action.payload, {
        checkedReqs: {
          ...state.tabRecord[action.payload.tabId].checkedReqs,
          [action.payload.reqId]: action.payload.checked
        }
      });

    case actionType.RESP_TEXT_CHANGE:
      return extendRequestRecords(state, action.payload, {
        responseText: action.payload.value
      });
    case actionType.STATUSCODE_CHANGE:
      return extendRequestRecords(state, action.payload, {
        statusCode: action.payload.value
      });
    case actionType.CONTENT_TYPE_CHANGE:
      return extendRequestRecords(state, action.payload, {
        contentType: action.payload.value
      });
    case actionType.PAGINATION_CHANGE:
      return extendTabRecords(state, action.payload, {
        PageDetails: {
          ...state.tabRecord[action.payload.tabId].PageDetails,
          [action.payload.field]: action.payload.value
        }
      });
    case actionType.UPDATE_MESSAGE: {
      return { ...state, interceptStatus: action.payload.message };
    }
    case actionType.UPDATE_INTERCEPTOR_STATUS:
      return extendTabRecords(state, action.payload, {
        isInterceptorOn: action.payload.value
      });
    case actionType.FETCH_DATA_IN_PROGRESS:
      return extendRequestRecords(state, action.payload, {
        fetching: action.payload.fetching
      });

    case actionType.FETCH_DATA_SUCCESS:
      return extendRequestRecords(state, action.payload, {
        serverResponse: action.payload.response
      });
    case actionType.FETCH_DATA_FAILURE:
      return extendRequestRecords(state, action.payload, {
        serverError: action.payload.error
      });
    case actionType.TOGGLE_LISTENING: {
      return extendTabRecords(state, action.payload, {
        enabledStatus: action.payload.enabledStatus
      });
    }
    case actionType.UPDATE_REQUEST:
      return requestsReducer(state, action.payload, [action.payload.request]);
    case actionType.CHANGE_URL_TABLE:
      return changeRequestUrl(state, action.payload);
    default:
      return state;
  }
};
