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

function extendStateData(state, action, props) {
  return {
    ...state,
    data: {
      ...state.data,
      [action.payload.tabId]: {
        ...state.data[action.payload.tabId],
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
        data: {
          ...state.data,
          [action.payload.currentTab]: {
            ...(state.data[action.payload.currentTab] || initialTabProperties)
          }
        },
        currentUrl: action.payload.currentUrl,
        currentTab: action.payload.currentTab
      };
    case actionType.ERROR:
      return extendStateData(state, action, {
        errorMessage: action.payload.errorMessage,
        enabledStatus: false
      });
    case actionType.CLEAR_REQUESTS:
      return extendStateData(state, action, {
        requests: []
      });
    case actionType.TOGGLE_CHECKBOX:
      return extendStateData(state, action, {
        checkedReqs: {
          ...state.data[action.payload.tabId].checkedReqs,
          [action.payload.reqId]: action.payload.checked
        }
      });
    case actionType.CLEAR_REQUESTS:
      return extendStateData(state, action, {
        checkedReqs: {
          ...state.data[action.payload.tabId].checkedReqs,
          [action.payload.reqId]: action.payload.checked
        }
      });
    case actionType.INTERCEPT_CHECKED:
      return { ...state };
    case actionType.RESP_TEXT_CHANGE:
      return extendStateData(state, action, {
        responseText: {
          ...state.data[action.payload.tabId].responseText,
          [action.payload.requestId]: action.payload.value
        }
      });
    case actionType.STATUSCODE_CHANGE:
      return extendStateData(state, action, {
        statusCodes: {
          ...state.data[action.payload.tabId].statusCodes,
          [action.payload.requestId]: action.payload.value
        }
      });
    case actionType.CONTENT_TYPE_CHANGE:
      return extendStateData(state, action, {
        contentType: {
          ...state.data[action.payload.tabId].contentType,
          [action.payload.requestId]: action.payload.value
        }
      });
    case actionType.PAGINATION_CHANGE:
      return extendStateData(state, action, {
        PageDetails: {
          ...state.data[action.payload.tabId].PageDetails,
          [action.payload.field]: action.payload.value
        }
      });
    case actionType.UPDATE_MESSAGE:
      return extendStateData(state, action, {
        interceptStatus: action.payload.message
      });
    case actionType.UPDATE_INTERCEPTOR_STATUS:
      return extendStateData(state, action, {
        isInterceptorOn: action.payload.value
      });
    case actionType.FETCH_DATA_SUCCESS:
      return extendStateData(state, action, {
        responseData: {
          ...state.data[action.payload.tabId].responseData,
          [action.payload.requestId]: action.payload.response
        }
      });
    case actionType.FETCH_DATA_FAILURE: {
      return extendStateData(state, action, {
        responseError: {
          ...state.data[action.payload.tabId].responseError,
          [action.payload.requestId]: action.payload.error
        }
      });
    }
    case actionType.TOGGLE_LISTENING: {
      return extendStateData(state, action, {
        enabledStatus: action.payload.enabledStatus
      });
    }
    case actionType.UPDATE_REQUEST:
      return extendStateData(state, action, {
        requests: action.payload.requests
      });
    default:
      return state;
  }
};
