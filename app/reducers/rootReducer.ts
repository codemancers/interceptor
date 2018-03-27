import {POPUP_PROPS, Action} from "../types";
export const INITIAL_POPUP_STATE: POPUP_PROPS = {
  enabled: false,
  tabId: -1,
  tabUrl: "",
  errorMessage: "",
  requests: [],
  checkedReqs: {},
  responseText: {},
  statusCodes: {},
  contentType: {},
  PageDetails: {},
  interceptStatus : ""
};

//ACTION CONSTANTS
import * as actionType from "../actions";

export const reducer = (state = INITIAL_POPUP_STATE, action: Action) => {
  switch (action.type) {
    case actionType.START_LISTENING:
      return {...state, enabled: action.payload};
    case actionType.UPDATE_FIELD:
      return {...state, [action.payload.name]: action.payload.value};
    case actionType.UPDATE_FIELDS:
      return {...state, ...action.payload};
    case actionType.STOP_LISTENING:
      return {...state, enabled: action.payload};
    case actionType.ERROR:
      return {...state, errorMessage: action.errorMessage, enabled: false};
    case actionType.CLEAR_REQUESTS:
      return {...state, requests: []};
    case actionType.TOGGLE_CHECKBOX:
      return {...state, checkedReqs: {...state.checkedReqs, [action.reqId]: action.checked}};
    case actionType.INTERCEPT_CHECKED:
      return {...state};
    case actionType.RESP_TEXT_CHANGE:
      return {
        ...state,
        responseText: {...state.responseText, [action.payload.requestId]: action.payload.value}
      };
    case actionType.STATUSCODE_CHANGE:
      return {
        ...state,
        statusCodes: {...state.statusCodes, [action.payload.requestId]: action.payload.value}
      };
    case actionType.CONTENT_TYPE_CHANGE:
      return {
        ...state,
        contentType: {...state.contentType, [action.payload.requestId]: action.payload.value}
      };
    case actionType.PAGINATION_CHANGE:
      return {
        ...state,
        PageDetails: {
          ...state.PageDetails,
          [action.payload.tabId]: {
            ...state.PageDetails[action.payload.tabId],
            [action.payload.field]: action.payload.value
          }
        }
      };
      case actionType.UPDATE_SUCCESS_MESSAGE:{
        return {...state, interceptStatus : action.message }
      }
    default:
      return state;
  }
};
