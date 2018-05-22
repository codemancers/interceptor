import { POPUP_PROPS, Action } from "../types";
import * as actionType from "../actions";

export const INITIAL_POPUP_STATE: POPUP_PROPS = {
  data: {},
  currentUrl: "",
  currentTab: -1
};

const initialTabProperties = {
  enabledStatus: false,
  requests: [],
  interceptStatus: "",
  errorMessage: "",
  PageDetails: [],
  checkedReqs: {},
  contentType: {},
  isInterceptorOn: true,
  responseData: {},
  responseError: {},
  responseText: {},
  statusCodes: {}
};

//ACTION CONSTANTS
export const reducer = (state = INITIAL_POPUP_STATE, action: Action) => {
  switch (action.type) {
    case actionType.INITIALISE_DEFAULTS: {
      console.log(state.data);
      return {
        ...state,
        currentUrl: action.payload.currentUrl,
        currentTab: action.payload.currentTab,
        data: {
          ...state.data,
          [action.payload.currentTab]: {
            ...(state.data[action.payload.currentTab] || initialTabProperties)
          }
        }
      };
    }
    case actionType.ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.tabId]: {
            ...state.data[action.payload.tabId],
            errorMessage: action.payload.errorMessage,
            enabledStatus: false
          }
        }
      };
    case actionType.CLEAR_REQUESTS:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.tabId]: {
            ...state.data[action.payload.tabId],
            requests: []
          }
        }
      };
    case actionType.TOGGLE_CHECKBOX:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.tabId]: {
            ...state.data[action.payload.tabId],
            checkedReqs: {
              ...state.data[action.payload.tabId].checkedReqs,
              [action.payload.reqId]: action.payload.checked
            }
          }
        }
      };
    case actionType.INTERCEPT_CHECKED:
      return { ...state };
    case actionType.RESP_TEXT_CHANGE:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.tabId]: {
            ...state.data[action.payload.tabId],
            responseText: {
              ...state.data[action.payload.tabId].responseText,
              [action.payload.requestId]: action.payload.value
            }
          }
        }
      };
    case actionType.STATUSCODE_CHANGE:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.tabId]: {
            ...state.data[action.payload.tabId],
            statusCodes: {
              ...state.data[action.payload.tabId].statusCodes,
              [action.payload.requestId]: action.payload.value
            }
          }
        }
      };
    case actionType.CONTENT_TYPE_CHANGE:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.tabId]: {
            ...state.data[action.payload.tabId],
            contentType: {
              ...state.data[action.payload.tabId].contentType,
              [action.payload.requestId]: action.payload.value
            }
          }
        }
      };
    case actionType.PAGINATION_CHANGE:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.tabId]: {
            ...state.data[action.payload.tabId],
            PageDetails: {
              ...state.data[action.payload.tabId].PageDetails,
              [action.payload.field]: action.payload.value
            }
          }
        }
      };
    case actionType.UPDATE_MESSAGE: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.tabId]: {
            ...state.data[action.payload.tabId],
            interceptStatus: action.payload.message
          }
        }
      };
    }
    case actionType.UPDATE_INTERCEPTOR_STATUS:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.tabId]: {
            ...state.data[action.payload.tabId],
            isInterceptorOn: action.payload.value
          }
        }
      };
    case actionType.FETCH_DATA_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.tabId]: {
            ...state.data[action.payload.tabId],
            responseData: {
              ...state.data[action.payload.tabId].responseData,
              [action.payload.requestId]: action.payload.response
            }
          }
        }
      };
    }
    case actionType.FETCH_DATA_FAILURE: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.tabId]: {
            ...state.data[action.payload.tabId],
            responseError: {
              ...state.data[action.payload.tabId].responseError,
              [action.payload.requestId]: action.payload.error
            }
          }
        }
      };
    }
    case actionType.TOGGLE_LISTENING: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.tabId]: {
            ...state.data[action.payload.tabId],
            enabledStatus: action.payload.enabledStatus
          }
        }
      };
    }
    case actionType.UPDATE_REQUEST: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.tabId]: {
            ...state.data[action.payload.tabId],
            requests: action.payload.requests
          }
        }
      };
    }
    default:
      return state;
  }
};
