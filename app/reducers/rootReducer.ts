import { POPUP_PROPS, Action } from "../types";
import * as actionType from "../actions";

export const INITIAL_POPUP_STATE: POPUP_PROPS = {
  tabRecord: {},
  currentUrl: "",
  currentTab: -1
};

const initialTabProperties = {
  enabledStatus: false,
  requests: [],
  interceptStatus: "",
  errorMessage: "",
  PageDetails: {
    currentRowSize: 10,
    currentPageNumber: 0
  },
  checkedReqs: {},
  contentType: {},
  isInterceptorOn: true,
  responseData: {},
  responseError: {},
  responseText: {},
  statusCodes: {}
};

function extendStateData(state: POPUP_PROPS, payload: any, props: any) {
  return {
    ...state,
    tabRecord: {
      ...state.tabRecord,
      [payload.tabId]: {
        ...state.tabRecord[payload.tabId],
        ...props
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
        currentTab: action.payload.currentTab
      };
    case actionType.ERROR:
      return extendStateData(state, action.payload, {
        errorMessage: action.payload.errorMessage,
        enabledStatus: false
      });
    case actionType.CLEAR_REQUESTS:
      return extendStateData(state, action.payload, {
        requests: []
      });
    case actionType.TOGGLE_CHECKBOX:
      return extendStateData(state, action.payload, {
        checkedReqs: {
          ...state.tabRecord[action.payload.tabId].checkedReqs,
          [action.payload.reqId]: action.payload.checked
        }
      });
    case actionType.CLEAR_REQUESTS:
      return extendStateData(state, action.payload, {
        checkedReqs: {
          ...state.tabRecord[action.payload.tabId].checkedReqs,
          [action.payload.reqId]: action.payload.checked
        }
      });
    case actionType.RESP_TEXT_CHANGE:
      return extendStateData(state, action.payload, {
        responseText: {
          ...state.tabRecord[action.payload.tabId].responseText,
          [action.payload.requestId]: action.payload.value
        }
      });
    case actionType.STATUSCODE_CHANGE:
      return extendStateData(state, action.payload, {
        statusCodes: {
          ...state.tabRecord[action.payload.tabId].statusCodes,
          [action.payload.requestId]: action.payload.value
        }
      });
    case actionType.CONTENT_TYPE_CHANGE:
      return extendStateData(state, action.payload, {
        contentType: {
          ...state.tabRecord[action.payload.tabId].contentType,
          [action.payload.requestId]: action.payload.value
        }
      });
    case actionType.PAGINATION_CHANGE:
      return extendStateData(state, action.payload, {
        PageDetails: {
          ...state.tabRecord[action.payload.tabId].PageDetails,
          [action.payload.field]: action.payload.value
        }
      });
    case actionType.UPDATE_MESSAGE:
      return extendStateData(state, action.payload, {
        interceptStatus: action.payload.message
      });
    case actionType.UPDATE_INTERCEPTOR_STATUS:
      return extendStateData(state, action.payload, {
        isInterceptorOn: action.payload.value
      });
    case actionType.FETCH_DATA_SUCCESS:
      return extendStateData(state, action.payload, {
        responseData: {
          ...state.tabRecord[action.payload.tabId].responseData,
          [action.payload.requestId]: action.payload.response
        }
      });
    case actionType.FETCH_DATA_FAILURE: {
      return extendStateData(state, action.payload, {
        responseError: {
          ...state.tabRecord[action.payload.tabId].responseError,
          [action.payload.requestId]: action.payload.error
        }
      });
    }
    case actionType.TOGGLE_LISTENING: {
      return extendStateData(state, action.payload, {
        enabledStatus: action.payload.enabledStatus
      });
    }
    case actionType.UPDATE_REQUEST:
      return extendStateData(state, action.payload, {
        requests: action.payload.requests
      });
    default:
      return state;
  }
};
