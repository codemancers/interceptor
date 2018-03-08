import {PopUpState, Action} from '../types'
export const INITIAL_POPUP_STATE : PopUpState = { enabled: false , errorMessage: "", requests: [], checkedReqs : {}, ResponseText: {}, interceptStatus: {}}

//ACTION CONSTANTS
import * as actionType from "../actions"

export const reducer = (state = INITIAL_POPUP_STATE, action: Action) => {
  switch (action.type) {
    case actionType.START_LISTENING:
      return {...state, enabled : true}
    case actionType.UPDATE_FIELD:
      return {...state, [action.name]: action.value };
    case actionType.UPDATE_FIELDS:
      return {...state,  ...action.payload};
    case actionType.STOP_LISTENING:
      return {...state, enabled: false};
    case actionType.ERROR:
      return {...state, errorMessage: action.errorMessage, enabled:false }
    case actionType.CLEAR_REQUESTS :
      return {...state, requests: [] }
    case actionType.TOGGLE_CHECKBOX:
      return {...state, checkedReqs: { ...state.checkedReqs, [action.reqId]: action.checked } }
    case actionType.INTERCEPT_CHECKED :
      return {...state}
    case actionType.RESP_TEXT_CHANGE:
      return {...state, ResponseText: {...state.ResponseText, [action.payload.requestId] : action.payload.value}}
    case actionType.STATUSCODE_CHANGE:
        return {...state, interceptStatus : {...state.interceptStatus, [action.payload.requestId] : action.payload.value} }
    default:
      return state;
  }
}